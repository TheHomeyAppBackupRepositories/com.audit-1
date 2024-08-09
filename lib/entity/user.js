"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = __importDefault(require("../entity"));
/**
  id: 'b1995d65-0f5c-4dfa-8efa-2a1467c739be',
  uri: 'homey:user:b1995d65-0f5c-4dfa-8efa-2a1467c739be',
  name: 'Jamie Peake',
  role: 'owner',
  properties: {
    favoriteFlows: [
      '1123558a-e3bb-431f-8511-899ffcd60c38',
      'b7fd4d75-f9a5-4d54-bc24-520042c48111',
      '5a087a90-889c-4337-b35c-974a399337d0'
    ],
    favoriteDevices: []
  },
  athomId: '5b21f8b99bed74641710e576',
  enabled: true,
  present: true,
  asleep: true,
  avatar: 'https://api.athom.com/user/5b21f8b99bed74641710e576/avatar',
  verified: true,
  inviteUrl: null,
  action: 'update'
 */
class User extends entity_1.default {
    async parse() {
        super.parse();
        this.object.detail = {
            asleep: this.asleep, // whether the user is asleep
            enabled: this.enabled, // whether the user is enabled
            present: this.present, // whether the user is present (at home)
            devices: this.devices, // number of favourite devices for this user
            flows: this.flows // number of favourite devices for this user
        };
    }
    get reason() {
        let output = super.reason;
        if (output == 'properties.favoriteDevices') {
            return 'favoriteDevices';
        }
        if (output == 'properties.favoriteFlows') {
            return 'favoriteFlows';
        }
        return output;
    }
    /**
     * The user is asleep.
     */
    get asleep() {
        return this.latest.asleep ?? false;
    }
    /**
     * The user is enabled.
     */
    get enabled() {
        return this.latest.asleep ?? false;
    }
    /**
     * The user is enabled.
     */
    get present() {
        return this.latest.present ?? false;
    }
    /**
     * The number of favourite device for the user
     */
    get devices() {
        if (typeof this.latest.properties.favoriteDevices !== 'undefined') {
            return this.latest.properties.favoriteDevices.length ?? 0;
        }
        return 0;
    }
    get flows() {
        if (typeof this.latest.properties.favoriteFlows !== 'undefined') {
            return this.latest.properties.favoriteFlows.length ?? 0;
        }
        return 0;
    }
    /**
     * Find all the fields which have changed, and then compare only giving specific description if a single item changed
     * @returns
     */
    get message() {
        let reason = this.reason;
        if (reason == 'name') {
            return this.previous.name + ' has been renamed to [' + this.latest.name + ']';
        }
        if (reason == 'enabled') {
            return this.latest.name + ' has been ' + ((this.latest.enabled) ? 'enabled' : 'disabled');
        }
        if (reason == 'present') {
            return this.latest.name + ' is now ' + ((this.latest.present) ? 'home' : 'away');
        }
        if (reason == 'asleep') {
            return this.latest.name + ' is now ' + ((this.latest.asleep) ? 'asleep' : 'awake');
        }
        if (reason == 'verified') {
            return this.latest.name + ' is ' + ((this.latest.verified) ? 'now' : 'not') + 'verified';
        }
        if (reason == 'favoriteDevices') {
            if (typeof this.previous !== 'undefined') {
                return this.latest.name + ' has ' + this.getIncrement(this.previous.properties.favoriteDevices, this.devices) + ' the number of favorite devices to ' + this.devices;
            }
            return this.latest.name + ' has updated their favorite devices';
        }
        if (reason == 'favoriteFlows') {
            if (typeof this.previous !== 'undefined') {
                return this.latest.name + ' has ' + this.getIncrement(this.previous.properties.favoriteFlows, this.flows) + ' the number of favorite flow to ' + this.flows;
            }
            return this.latest.name + ' has updated their favorite flows';
        }
        let fields = this.fields;
        if (fields.length == 1) {
            return this.latest.name + ' has updated their ' + fields[0] + ' to ' + this.latest[fields[0]];
        }
        return super.message;
    }
    convert(obj, key = '', result = {}) {
        if (typeof obj !== 'object') {
            result[key] = obj;
            return result;
        }
        if (obj == null) {
            result[key] = obj;
            return result;
        }
        // Ignore the details of arrays
        if (Array.isArray(obj)) {
            result[key] = obj.length;
            return result;
        }
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const newKey = key ? (key + '.' + keys[i]) : keys[i];
            this.convert(obj[keys[i]], newKey, result);
        }
        return result;
    }
}
exports.default = User;
