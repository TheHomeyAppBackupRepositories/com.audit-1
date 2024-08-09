"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = __importDefault(require("./store"));
class Watcher {
    /**
     * Construct
     * @param api
     * @param flows
     * @param alias
     */
    constructor(api, flows, alias) {
        /**
         * Initialize the store and listeners
        */
        this.initialize = async () => {
            await this.alias.manager.connect();
            await this.initStore();
            await this.initListeners();
        };
        /**
         * Adds listeners on homey updates, which trigger flows
         * This uses a very generic approach, for default purposes
         */
        this.initListeners = async () => {
            this.alias.manager.on(this.alias.listener + '.' + 'create', async (data) => {
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
         * Initialise all values and create a store of values locally
         *
         * Will ideally call the child method to 'values' to populate
         * @returns void
         */
        this.initStore = async () => {
            this.store = new store_1.default(this.alias.entity);
            // Populate the store with starting values
            let objects = await this.getValues();
            for (const property in objects) {
                this.trigger('initialise', objects[property]);
            }
        };
        this.api = api;
        this.flows = flows;
        this.alias = alias;
    }
    /**
     * Code which will set the entity into the store and trigger the flow
    */
    async trigger(action, data) {
        let store = await this.store.parse(action, data);
        if (store.publish) {
            this.alias.log.log(store);
            this.alias.triggers.trigger({ ...{ message: store.message, level: store.level }, ...store.detail, ...store.meta });
        }
    }
}
exports.default = Watcher;
