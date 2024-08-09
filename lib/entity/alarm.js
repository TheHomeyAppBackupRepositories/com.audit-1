"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = __importDefault(require("../entity"));
/**
  id: 'e246ccf3-1c94-4007-9536-13f387077980',
  uri: 'homey:alarm:e246ccf3-1c94-4007-9536-13f387077980',
  name: 'Weekday Alarm!',
  time: '14:46',
  repetition: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: true,
    friday: false,
    saturday: true,
    sunday: false
  },
  enabled: false,
  nextOccurance: '2024-01-11T03:46:00.000Z'
 */
class Alarm extends entity_1.default {
    async parse() {
        await super.parse();
        this.object.detail = {
            time: this.time, // Time of the alarm
            enabled: this.enabled // Is the alarm enabled
        };
    }
    /**
     * Returns an alphabetical array of the properties which have changed
     * @todo make alphabetical
     */
    get fields() {
        return this.difference(this.convert(this.previous), this.convert(this.latest), ['usage']).sort();
    }
    /**
     * Returns the (human) description of what happened.
     * This does not persist and will change on each event
     */
    get message() {
        let reason = this.reason;
        if (reason == 'name' || reason == 'rename') {
            return this.previous.name + ' has been renamed to ' + this.latest.name + '';
        }
        if (reason == 'enabled' || reason == 'disabled') {
            return this.latest.name + ' has been ' + reason;
        }
        if (reason == 'time') {
            return this.latest.name + ' time has been updated from ' + this.previous.time + ' to ' + this.latest.time;
        }
        return super.message;
    }
    /**
     * The alarms time
     */
    get time() {
        return this.latest.time ?? this.previous.time ?? '';
    }
    /**
     * Whether the alarm is enabled
     */
    get enabled() {
        return this.latest.enabled ?? this.previous.enabled ?? false;
    }
}
exports.default = Alarm;
