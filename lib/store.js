"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manager_1 = __importDefault(require("./manager"));
/**
 * Class for the management of a multiton as a factory
 * requires the entity.
 */
class Store {
    /**
     * Construct
     * @param entity the entity class to create, if it doesn't exist
     */
    constructor(entity) {
        /**
         * Initialise all values and create a store of values locally
         *
         * Used to compare new/old updates and have info on deleted items.
         * @returns void
         */
        this.initialise = async (values) => {
            for (const value of values) {
                await this.parse('initialise', value);
            }
        };
        this.store = [];
        this.entity = entity;
    }
    async parse(action, info) {
        let x = this.factory(info);
        return await this.store[x].parse(action, info);
    }
    // /**
    //  * Updates the entity store with the latest info
    //  * @param action 
    //  * @param info 
    //  */
    // public async set(action: string, info: any) {
    //     let x = this.factory(info)
    //     await this.store[x].parse(action, info)
    // }
    // /**
    //  * Returns the item from the store
    //  * @param id 
    //  * @returns 
    //  */
    // public get(id: number) : any {
    //     return this.store[this.factory({id: id})].parse()
    // }
    /**
     * Returns all the keys with in the store
     */
    get keys() {
        const ids = [];
        this.store.forEach(({ id }) => ids.push(id));
        return ids;
    }
    /**
     * Finds an item in the store, or creates if it doesn't exist
     * @param info
     * @returns
     */
    factory(info) {
        if (this.store.find(existing => existing.id === info.id) === undefined) {
            this.store.push(new manager_1.default(info.id, this.entity));
        }
        return this.store.findIndex(existing => existing.id === info.id);
    }
}
exports.default = Store;
