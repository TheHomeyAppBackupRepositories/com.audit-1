"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = __importDefault(require("../entity"));
/**
{
  id: 'e64d5d0b-abac-4108-88ae-c8f0b189b374',
  name: 'Dim level',
  action: 'update',
  type: '',
  title: 'Lights',
  brief: '🧷 Dining Lights Dim level updated',
  description: '🧷 Dining Lights Dim level has been updated [39% => 27%]',
  capability: 'dim',
  device: '🧷 Dining Lights',
  zone: 'Dining',
  outcome: 'capabilitiesObj.dim.value,capabilitiesObj.dim.lastUpdated',
  ignore: false
}

onoff: {
    id: 'onoff',
    type: 'boolean',
    iconObj: null,
    title: 'Turned on',
    getable: true,
    setable: true,
    insights: true,
    insightsTitleTrue: 'Turned on',
    insightsTitleFalse: 'Turned off',
    value: false,
    lastUpdated: '2024-01-11T08:53:08.134Z'
  },

  alarm_contact: {
    id: 'alarm_contact',
    type: 'boolean',
    iconObj: null,
    title: 'Contact alarm',
    getable: true,
    setable: false,
    insights: true,
    insightsTitleTrue: 'Contact alarm turned on',
    insightsTitleFalse: 'Contact alarm turned off',
    value: false,
    lastUpdated: '2024-01-11T08:47:58.587Z'
  }
**/
class Capability extends entity_1.default {
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
        this.levels.debug = ['meter', 'speaker_position', 'se_last_seen_seconds', 'se_last_seen', 'duration'];
        this.levels.info = ['measure', 'speaker'];
        this.levels.notice = ['onoff', 'dim', 'light', 'windowcoverings', 'vacuumcleaner', 'thermostat_mode', 'target_temperature', 'volume'];
        this.levels.warning = ['alarm_motion', 'alarm_battery', 'alarm_contact', 'alarm_generic', 'alarm_battery'];
        this.levels.error = [];
        this.levels.critical = ['locked', 'lock_mode', 'garagedoor_closed', 'homealarm_state'];
        this.levels.alert = ['alarm', 'homealarm_state'];
        // this.levels.debug = ['meter', 'se_last_seen_seconds', 'se_last_seen', 'meter_power.week', 'meter_power', 'meter_power.month', 'meter_power.year', 'measure_voltage', 'measure_power', 'measure_current']
        // this.levels.info = ['measure']
        // this.levels.notice = ['onoff', 'dim', 'light', 'windowcoverings']
        // this.levels.warning = ['alarm_motion', 'alarm_battery', 'thermostat_mode', 'target_temperature', 'garagedoor_closed', 'locked', 'lock_mode']
        // this.levels.alert = ['alarm', 'homealarm_state']
        if (this.code !== 'undefined') {
            this.capability = this.latest.capabilitiesObj[this.code];
        }
    }
    async parse() {
        await super.parse();
        this.object.detail = {
            code: this.code, // The capability code
            device: this.device, // The name of the device
            type: this.type, // The type of capability
            value: this.value, // The value of the change
            zone: await this.getZone(), //
            owner: this.owner,
            driver: this.driver
        };
    }
    async getZone() {
        let zone = await this.actual.getZone();
        return zone.name;
    }
    get level() {
        let reason = this.reason;
        let type = this.type;
        let name;
        if (this.owner === 'com.swttt.devicegroups') {
            return 'debug';
        }
        for (name in this.levels) {
            if (this.levels[name].some((value) => reason.startsWith(value))) {
                return name;
            }
        }
        for (name in this.levels) {
            if (this.levels[name].some((value) => type.startsWith(value))) {
                return name;
            }
        }
        return 'notice';
    }
    get owner() {
        let output = '';
        if (typeof this.latest !== "undefined") {
            output = this.latest.ownerUri ?? '';
            output = output.replace('homey:app:', '');
            output = output.replace('homey:manager:', '');
        }
        return output.toLowerCase();
    }
    get driver() {
        let output = '';
        if (typeof this.latest !== "undefined") {
            output = this.latest.driverId ?? '';
            output = output.replace('homey:virtualdriver', '');
            output = output.replace(this.latest.ownerUri + ':', '');
        }
        return output.toLowerCase();
    }
    /**
     * Capability name
     */
    get name() {
        let output = '';
        if (typeof this.capability != 'undefined') {
            output = this.capability.title ?? '';
        }
        return output;
    }
    /**
     * Capability Code
     */
    get code() {
        let output = 'undefined';
        if (typeof this.previous !== 'undefined') {
            output = this.difference(this.convert(this.previous.capabilitiesObj), this.convert(this.latest.capabilitiesObj)).toString();
        }
        return output;
    }
    /**
     * The device name
     */
    get device() {
        return this.latest.name ?? '';
    }
    /**
     * Description of the action
     */
    get description() {
        let output = '';
        let capability = this.capability;
        if (typeof capability !== 'undefined') {
            output += capability.title;
            if (capability.type == "boolean") {
                if (capability.insightsTitleTrue === null) {
                    return output + ' turned ' + ((capability.value) ? 'on' : 'off');
                }
                if (capability.value === true) {
                    return (capability.insightsTitleTrue) ?? '';
                }
                if (capability.value === false) {
                    return (capability.insightsTitleFalse) ?? '';
                }
            }
        }
        return output;
    }
    /**
     * The capability changed value
     */
    get value() {
        let output = '';
        if (typeof this.latest !== 'undefined') {
            output = this.form(this.capability);
        }
        return output;
    }
    /**
     * The value prior to the change
     */
    get prior() {
        let output = '';
        if (typeof this.previous !== 'undefined') {
            output = this.form(this.previous.capabilitiesObj[this.code]);
        }
        return output;
    }
    form(capability) {
        let output = '';
        if (typeof capability !== 'undefined') {
            let value = capability.value;
            value = (capability.id == 'dim' || capability.id === 'volume_set' || capability.id === 'light_hue' || capability.id === 'light_saturation') ? (capability.value * 100) : value;
            value = (typeof value == 'number') ? (Math.round(value * 100) / 100) : value;
            output = value + (capability.units ?? '');
        }
        return output;
    }
    /**
     * The error message
     */
    get message() {
        let output = this.device;
        let capability = this.capability;
        if (typeof capability !== 'undefined') {
            // if (capability.value === true || capability.value === false) {
            //     return output + ' ' + this.description
            // }
            if (capability.type === "boolean") {
                return output + ' ' + this.description;
            }
            if (typeof this.previous !== 'undefined' && typeof this.latest !== 'undefined') {
                if (capability.type === "number") {
                    output += ' ' + this.description + ' ';
                    output += this.getIncrement(this.previous.capabilitiesObj[this.code].value, this.latest.capabilitiesObj[this.code].value);
                    return output + ' from ' + this.prior + ' to ' + this.value + '';
                }
                return output + ' ' + this.latest.capabilitiesObj[this.code].title + ' ' + this.action + 'd from ' + this.prior + ' to ' + this.value + '';
            }
            return output + ' ' + this.description + ' ' + this.action + 'd to ' + this.value + '';
        }
        return output;
    }
    /**
     * The type of capability
     */
    get type() {
        return this.code.split('_')[0];
    }
    /**
     * Returns an alphabetical array of the properties which have changed
     * @todo make alphabetical
     */
    get fields() {
        if (typeof this.previous !== 'undefined') {
            return this.difference(this.convert(this.previous.capabilitiesObj), this.convert(this.latest.capabilitiesObj), ['lastUpdated']);
        }
        return [];
    }
    convert(object) {
        let output = {};
        for (const property in object) {
            output[property] = object[property].value;
        }
        return output;
    }
}
exports.default = Capability;
