"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Manager {
    /**
     * Construct
     * @param id
     * @param input
     * @param store Use this parameter if you want to check  the previous state for changes.
     */
    constructor(id, entity) {
        this.id = id;
        this.class = entity;
    }
    /**
     * Sets up the old and new values then parses then updating the class properties
     * @param action
     * @param info
     * @returns
     */
    async parse(action, info) {
        this.actual = info;
        if (typeof this.latest !== 'undefined') {
            this.previous = JSON.parse(JSON.stringify(this.latest));
        }
        this.latest = JSON.parse(JSON.stringify(info));
        // We send through the actual item
        let entity = new this.class(action, this.actual, this.latest, this.previous);
        await entity.parse();
        return entity.format();
    }
}
exports.default = Manager;
