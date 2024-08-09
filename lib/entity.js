"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Entity {
    /**
     * Construct
     *
     * Use these parameter if you want to check the previous state for changes.
     *
     * @param action The action occurring
     * @param actual The Actual object, to perform methods upon
     * @param latest Latest property information
     * @param previous Previous (to the change) property information
     */
    constructor(action, actual, latest, previous) {
        this.action = action;
        this.actual = actual;
        // Deep copy so we have a copy of the values rather then reference
        this.latest = JSON.parse(JSON.stringify(latest));
        if (typeof previous !== 'undefined') {
            this.previous = JSON.parse(JSON.stringify(previous));
        }
        this.object = {
            message: '',
            level: 'info',
            publish: false,
            meta: {
                id: actual.id,
                name: this.name,
                action: this.action,
                entity: this.entity,
                fields: this.fields,
                reason: this.reason,
                timestamp: Date.now()
            },
            detail: {}
        };
        this.levels = {
            debug: [],
            info: [],
            notice: [],
            warning: ['name'],
            error: [],
            critical: [],
            alert: [],
            emergency: []
        };
    }
    /**
     * Returns the raw object
     *
     * In the future we may look at moving the detail and meta from the object and then placing back in during the format()
     * Which would make this method more useful, currently largely a placeholder.
     * @returns object
     */
    async get() {
        await this.parse();
        return this.object;
    }
    /**
     * Parses the old and new information to determine the current state
     * Does this in a agnostic way, just going through each property
     */
    async parse() {
        this.object.publish = this.publish;
        this.object.message = this.message;
        this.object.level = this.level;
        this.object.meta.name = this.name;
        this.object.meta.action = this.action;
        this.object.meta.entity = this.entity;
        this.object.meta.fields = this.fields;
        this.object.meta.reason = this.reason;
        this.object.meta.timestamp = this.timestamp;
    }
    /**
     * Alias to which returns the objects properties
     */
    format() {
        let output = {
            message: this.object?.message,
            level: this.object?.level,
            publish: this.object?.publish,
            detail: this.object?.detail,
            meta: this.object?.meta
        };
        let debug = false;
        if (debug) {
            output.latest = this.latest;
        }
        if (debug) {
            output.previous = this.previous;
        }
        return output;
    }
    /**
     * Will determine which properties have different values between two objects
     * @returns a string of properties which have changed
     */
    difference(x, y, ignore = []) {
        return Object.keys(x).filter(k => (k !== 'action' && // ignore the action, as the previous might have been initialised
            typeof x[k] !== 'object' && // ignore objects for now (too hard to manage)
            !ignore.includes(k) && // remove last active date as its always different
            x[k] !== y[k])); // the actual comparison
    }
    /**
     * Flattens an object (so that we can compare it)
     * @param object which object to flatten
     * @returns
     */
    convert(object) {
        let output = {};
        for (const property in object) {
            if (typeof object[property] == 'object') {
                output[property] = JSON.stringify(object[property]);
            }
            else {
                output[property] = object[property];
            }
        }
        return output;
    }
    /**
     * Returns the increment type
     * @param previous
     * @param latest
     * @returns
     */
    getIncrement(previous, latest) {
        return (previous === latest) ? 'changed' : (previous < latest ? 'increased' : 'decreased');
    }
    /**
     * The name of the item which was altered
     * This could persist as it rarely changes
     */
    get name() {
        return this.latest?.name ?? this.previous?.name ?? '';
    }
    /**
     * Returns the current timestamp
     */
    get timestamp() {
        return Date.now();
    }
    /**
     * The name of the entity type which has had the action occur upon it
     * device, alarm, user etc.
     */
    get entity() {
        const entity = this.constructor?.name ?? 'unknown';
        return entity.toLowerCase();
    }
    /**
     * Returns an alphabetical array of the properties which have changed
     * @todo update so that it is not triggered when the capability lastUpdated is changed
     */
    get fields() {
        return this.difference(this.convert(this.previous), this.convert(this.latest), ['lastUpdated']).sort();
    }
    /**
     * Looks into the this.levels to see if the reason should have a specific level
     * defaults to info
     */
    get level() {
        let reason = this.reason;
        let name;
        for (name in this.levels) {
            if (this.levels[name].includes(reason)) {
                return name;
            }
        }
        if (this.action == 'create' || this.action == 'delete') {
            return 'crit';
        }
        if (this.action == 'initialise') {
            return 'debug';
        }
        return 'notice';
    }
    /**
     * Returns the (human) description of what happened.
     * This does not persist and will change on each event
     */
    get message() {
        let output = this.name + ' has been ' + this.action + 'd';
        let fields = this.fields;
        if (this.action === 'update') {
            if (fields.length == 1) {
                if (fields.includes('name')) {
                    return this.previous.name + ' has been renamed to "' + this.latest.name + '"';
                }
                return output + ' from "' + this.previous.value + '" to "' + this.latest.value + '"';
            }
        }
        return output;
    }
    /**
     * An OPINIONATED reason as to why the event is being published
     *
     * We want to simplify this values as much as possible, by removing chain reaction changes
     * This will be generally be the name of the main field which has been altered.
     *
     * This does not persist and will change on each event, blank when no change
     */
    get reason() {
        let fields = this.fields;
        if (fields.length == 1) {
            return fields[0];
        }
        return (fields.length) ? 'unknown' : 'none';
    }
    /**
     * Generally used as a check to see if the update can be ignored - ie, a field we do not care if it changes.
     * Or ignoring when the number of active devices changes in a zone, also ignore if we cant find any changed fields
     *
     * By default, ignore the initialisation and publish and create and delete
     * @returns Whether or not we can ignore the latest alteration
     */
    get publish() {
        if (this?.action == 'update') {
            return (!!this.fields.length);
        }
        return (this?.action != 'initialise');
    }
}
exports.default = Entity;
