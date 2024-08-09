"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zone_1 = __importDefault(require("../entity/zone"));
const watcher_1 = __importDefault(require("../watcher"));
class Zone extends watcher_1.default {
    /**
     * Set the alias and call the parent
     */
    constructor(api, flows, log) {
        super(api, flows, {
            // @ts-expect-error athom definition issue
            manager: api.zones,
            triggers: flows.triggers.zone,
            entity: zone_1.default,
            listener: 'zone',
            log: log
        });
        /**
         * Assign the values from the manager
         * @returns
         */
        this.getValues = async () => {
            return await this.alias.manager.getZones();
        };
    }
}
exports.default = Zone;
