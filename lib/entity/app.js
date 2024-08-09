"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = __importDefault(require("../entity"));
class App extends entity_1.default {
    /**
     * Returns an alphabetical array of the properties which have changed
     * @todo make alphabetical
     */
    get fields() {
        return this.difference(this.convert(this.previous), this.convert(this.latest), ['usage']).sort();
    }
    get message() {
        let fields = this.fields;
        if (this.action !== 'update') {
            return this.name + ' has been ' + ((this.action == 'create') ? 'installe' : this.action) + 'd';
        }
        if (fields.length === 1) {
            if (this.reason == 'name') {
                return this.previous.name + ' has been renamed to ' + this.latest.name + '';
            }
            if (this.reason == 'state') {
                return this.latest.name + ' is now ' + this.latest.state;
            }
            if (this.reason == 'updateAvailable') {
                return this.latest.name + ' has an update available ' + this.latest.updateAvailable;
            }
            if (this.reason == 'autoupdate') {
                return this.latest.name + ' will ' + ((this.latest[fields[0]]) ? 'now' : 'no longer') + ' ' + fields[0];
            }
            if (this.reason == 'enabled' || this.reason == 'ready') {
                return this.latest.name + ' is ' + ((this.latest[fields[0]]) ? 'now' : 'no longer') + ' ' + fields[0];
            }
            return this.latest.name + ' ' + fields[0] + ' has been updated [' + this.latest[fields[0]] + ']';
        }
        if (fields.length === 2) {
            if (fields.includes('enabled')) {
                return this.latest.name + ' is ' + ((this.latest[fields[0]]) ? 'now' : 'no longer') + ' ' + fields[0];
            }
            if (fields.includes('state') && fields.includes('ready')) {
                return this.latest.name + ' ' + ((this.latest.ready) ? 'is' : 'no longer') + ' ready and now ' + this.latest.state;
            }
        }
        // We want to do some extra checks here, so check that the previous item exists. 
        if (typeof this.previous !== 'undefined') {
            if (this.previous.crashCount && this.latest.crashCount) {
                if (this.previous.crashCount !== this.latest.crashCount && this.latest.crashCount > 0) {
                    return this.latest.name + ' has crashed ' + this.latest.crashMessage + ' times [' + this.latest.crashMessage + ']';
                }
            }
        }
        return this.name + ' has been ' + this.action + 'd';
    }
}
exports.default = App;
