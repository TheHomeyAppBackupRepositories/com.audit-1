"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flow_1 = __importDefault(require("../entity/flow"));
const watcher_1 = __importDefault(require("../watcher"));
class Flow extends watcher_1.default {
    /**
     * Set the alias and call the parent
     */
    constructor(api, flows, log) {
        super(api, flows, {
            // @ts-expect-error athom definition issue
            manager: api.flow,
            triggers: flows.triggers.flow,
            entity: flow_1.default,
            listener: 'flow',
            log: log
        });
        /**
         * Assign the values from the manager
         * @returns
         */
        this.getValues = async () => {
            return await this.alias.manager.getFlows();
        };
    }
}
exports.default = Flow;
