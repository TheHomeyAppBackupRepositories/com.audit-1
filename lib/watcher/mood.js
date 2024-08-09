"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mood_1 = __importDefault(require("../entity/mood"));
const watcher_1 = __importDefault(require("../watcher"));
class Mood extends watcher_1.default {
    /**
     * Set the alias and call the parent
     */
    constructor(api, flows, log) {
        let alias = {
            // @ts-expect-error athom definition issue
            manager: api.moods,
            triggers: flows.triggers.mood,
            entity: mood_1.default,
            listener: 'mood',
            log: log
        };
        super(api, flows, alias);
        /**
         * Assign the values from the manager
         * @returns
         */
        this.getValues = async () => {
            return await this.alias.manager.getMoods();
        };
    }
}
exports.default = Mood;
