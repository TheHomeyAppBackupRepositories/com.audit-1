"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = __importDefault(require("../entity"));
/**
    "id": "f3ed2989-a385-4cfa-8919-25d64dbbb4c1",
    "uri": "homey:zone:f3ed2989-a385-4cfa-8919-25d64dbbb4c1",
    "name": "Entrance",
    "parent": "37782dac-6d40-40a2-a0a4-17a0dd05003a",
    "active": false,
    "activeOrigins": [],
    "activeLastUpdated": "2024-01-07T08:51:10.906Z",
    "icon": "entrance",
*/
class Zone extends entity_1.default {
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
        super(action, actual, latest, previous);
        this.levels.debug = ['activeOrigins'];
    }
    async parse() {
        await super.parse();
        this.object.detail = {
            zone: this.zone, // The name of the zone, used for grouping the logs
            active: this.active // Whether or not the zone is active
        };
    }
    /**
     * An OPINIONATED reason as to why the event is being published
     *
     * We want to simplify this values as much as possible, by removing chain reaction changes
     * This will be generally be the name of the main field which has been altered.
     *
     * With zones, most often we want to override the other values and focus on if the zone becomes active
     */
    get reason() {
        let output = super.reason;
        let fields = this.fields;
        // ignore time changes override nextOccurance 
        if (fields.length == 2 && fields.includes('activeOrigins')) {
            if (fields.includes('active')) {
                return 'active';
            }
        }
        return output;
    }
    /**
     * Used for the grouping of messages by zone
     */
    get zone() {
        return this.name.toLowerCase();
    }
    /**
     * Whether the zone is active or not
     */
    get active() {
        return (this.latest.active) ? true : false;
    }
    /**
     * Number of devices active in the zone
     */
    get devices() {
        return (this.latest.activeOrigins.length) ?? 0;
    }
    /**
     * Returns an alphabetical array of the properties which have changed
     * @todo make alphabetical
     */
    get fields() {
        return this.difference(this.convert(this.previous), this.convert(this.latest), ['activeLastUpdated']).sort();
    }
    /**
     * The description will alter its noun and variable data base don what type it is.
     * @todo change to string representations so that we can use i18n
     * @returns string description of the last action on the zone
     */
    get message() {
        let reason = this.reason;
        let output = 'Zone ' + this.action + 'd';
        if (this.action === 'create') {
            return output;
        }
        if (this.action === 'initialise') {
            return 'Zone "' + this.name + '" has been ' + this.action + 'd';
        }
        if (reason == 'name') {
            return this.previous.name + ' zone has been renamed to ' + this.name + '';
        }
        if (reason == 'active') {
            return this.name + ' has became ' + ((this.active) ? 'active' : 'inactive');
        }
        if (reason == 'activeOrigins') {
            return 'The number of active devices in ' + this.name + ' has ' +
                (this.getIncrement(this.previous.activeOrigins.length, this.latest.activeOrigins.length)) +
                ' to ' + this.latest.activeOrigins.length + '';
        }
        if (reason == 'parent') {
            return this.name + ' zone\'s parent has been changed';
        }
        if (reason == 'icon') {
            output += ' ' + this.fields[0] + ' from ' + this.previous[this.fields[0]] + ' to ' + this.latest[this.fields[0]];
        }
        return output;
    }
}
exports.default = Zone;
