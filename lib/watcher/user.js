"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../entity/user"));
const watcher_1 = __importDefault(require("../watcher"));
class User extends watcher_1.default {
    /**
     * Set the alias and call the parent
     */
    constructor(api, flows, log) {
        super(api, flows, {
            // @ts-expect-error athom definition issue
            manager: api.users,
            triggers: flows.triggers.user,
            entity: user_1.default,
            listener: 'user',
            log: log
        });
        /**
         * Adds listeners on homey updates, which trigger flows
         * This uses a very generic approach, for default purposes
         */
        this.initListeners = async () => {
            this.alias.manager.on(this.alias.listener + '.' + 'create', async (data) => {
                this.alias.triggers.trigger();
                await this.trigger('create', data);
            });
            this.alias.manager.on(this.alias.listener + '.' + 'update', async (data) => {
                await this.trigger('update', data);
            });
            this.alias.manager.on(this.alias.listener + '.' + 'delete', async (data) => {
                await this.trigger('delete', data);
            });
        };
        /**
         * Assign the values from the manager
         * @returns
         */
        this.getValues = async () => {
            return await this.alias.manager.getUsers();
        };
    }
}
exports.default = User;
