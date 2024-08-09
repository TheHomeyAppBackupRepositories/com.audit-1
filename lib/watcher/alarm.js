"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alarm_1 = __importDefault(require("../entity/alarm"));
const watcher_1 = __importDefault(require("../watcher"));
class Alarm extends watcher_1.default {
    /**
     * Set the alias and call the parent
     */
    constructor(api, flows, log) {
        super(api, flows, {
            // @ts-expect-error athom definition issue
            manager: api.alarms,
            triggers: flows.triggers.alarm,
            entity: alarm_1.default,
            listener: 'alarm',
            log: log
        });
        /**
         * Assign the values from the manager
         * @returns
         */
        this.getValues = async () => {
            return await this.alias.manager.getAlarms();
        };
    }
}
exports.default = Alarm;
