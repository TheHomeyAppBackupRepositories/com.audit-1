"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logic_1 = __importDefault(require("../entity/logic"));
const watcher_1 = __importDefault(require("../watcher"));
class Logic extends watcher_1.default {
    /**
     * Set the alias and call the parent
     */
    constructor(api, flows, log) {
        super(api, flows, {
            // @ts-expect-error athom definition issue
            manager: api.logic,
            triggers: flows.triggers.logic,
            entity: logic_1.default,
            listener: 'variable',
            log: log
        });
        /**
         * Assign the values from the manager
         * @returns
         */
        this.getValues = async () => {
            return await this.alias.manager.getVariables();
        };
    }
}
exports.default = Logic;
