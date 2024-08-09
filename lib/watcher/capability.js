"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const capability_1 = __importDefault(require("../entity/capability"));
const watcher_1 = __importDefault(require("../watcher"));
class Capability extends watcher_1.default {
    /**
     * Set the alias
     */
    constructor(api, flows, devices, log) {
        super(api, flows, {
            // @ts-expect-error athom definition issue
            manager: api.devices,
            triggers: flows.triggers.capabilities,
            entity: capability_1.default,
            listener: 'device',
            log: log
        });
        /**
         * Adds listeners on homey updates, which trigger flows
         * This uses a very generic approach, for default purposes
         * @todo pass in the value once up and running
        */
        this.initListeners = async () => {
            let a = {};
            for (let x in this.devices.store.store) {
                a.device = this.devices.store.store[x].actual;
                for (let c in a.device.capabilities) {
                    a.capability = a.device.capabilities[c];
                    // @todo NOTE this does NOT trigger if the device has been created after load. 
                    a.device.makeCapabilityInstance(a.capability, (value) => {
                        this.trigger('update', this.devices.store.store[x].actual);
                    });
                }
            }
        };
        /**
          * Assign the values from the manager
          * @returns
          */
        this.getValues = async () => {
            return await this.alias.manager.getDevices();
        };
        this.devices = devices;
    }
    /**
     * Code which will set the entity into the store and trigger the flow
     * Override the default trigger and ensure the capability specific trigger is called
     * @todo NOTE this does NOT trigger if the device has been created after load.
    */
    async trigger(action, data) {
        let store = await this.store.parse(action, data);
        if (store.publish) {
            delete store.publish;
            this.alias.log.log(store);
            // store.detail.type
            if (this.alias.triggers.hasOwnProperty(store.detail.type)) {
                this.alias.triggers[store.detail.type].trigger({ ...{ message: store.message, level: store.level }, ...store.detail, ...store.meta });
            }
            else {
                this.alias.triggers['other'].trigger({ ...{ message: store.message, level: store.level }, ...store.detail, ...store.meta });
            }
        }
    }
}
exports.default = Capability;
