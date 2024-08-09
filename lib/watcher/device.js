"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const device_1 = __importDefault(require("../entity/device"));
const watcher_1 = __importDefault(require("../watcher"));
class Devices extends watcher_1.default {
    /**
     * Set the alias and call the parent
     */
    constructor(api, flows, log) {
        super(api, flows, {
            // @ts-expect-error athom definition issue
            manager: api.devices,
            triggers: flows.triggers.device,
            entity: device_1.default,
            listener: 'device',
            log: log
        });
        /**
         * Assign the values from the manager
         * @returns
         */
        this.getValues = async () => {
            return await this.alias.manager.getDevices();
        };
    }
}
exports.default = Devices;
