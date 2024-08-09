"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = __importDefault(require("../entity"));
// 'f7d71242-35b6-4870-93e6-a3ad97a625e8': Flow {
//     id: 'f7d71242-35b6-4870-93e6-a3ad97a625e8',
//     uri: 'homey:flow:f7d71242-35b6-4870-93e6-a3ad97a625e8',
//     name: '^deviceWindowsCoveringsChanged',
//     folder: '3aad943e-84bb-40c8-be7d-96603231e191',
//     enabled: true,
//     broken: false,
//     triggerable: true,
//     trigger: {
//       id: 'homey:app:dev.audit:capability_windowcoverings',
//       uri: 'homey:app:dev.audit',
//       args: {}
//     },
//     conditions: [],
//     actions: [ [Object] ]
//   }
// }
class Flow extends entity_1.default {
    async parse() {
        await super.parse();
        this.object.detail = {
            enabled: this.enabled, // Whether the flow is enabled
            broken: this.broken // Whether the flow is broken
        };
    }
    get enabled() {
        return this.latest.enabled;
    }
    get broken() {
        return this.latest.broken;
    }
    get message() {
        let reason = this.reason;
        if (this.action === 'initialise') {
            return 'Flow "' + this.name + '" has been ' + this.action + 'd';
        }
        if (reason == 'name') {
            return this.previous.name + ' has been renamed to ' + this.name + '';
        }
        if (reason == 'enabled') {
            return this.name + ' has been ' + ((this.enabled) ? 'enabled' : 'disabled');
        }
        if (reason == 'broken') {
            return this.name + ' has been ' + ((this.broken) ? 'broken' : 'fixed');
        }
        if (reason == 'broken') {
            return this.name + ' has been moved to a new folder';
        }
        return this.name + ' has been ' + this.action + 'd';
    }
}
exports.default = Flow;
