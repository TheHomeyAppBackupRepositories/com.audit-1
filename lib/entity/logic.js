"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = __importDefault(require("../entity"));
/**
  id: 'b2522765-565b-4672-88ea-1ba193c76d29',
  uri: 'homey:variable:b2522765-565b-4672-88ea-1ba193c76d29',
  name: 'porch-active-override',
  type: 'boolean',
  value: false,
  action: 'initialise'
 */
class Logic extends entity_1.default {
    async parse() {
        await super.parse();
        this.object.detail = {
            value: this.value, // The type of variable, string, boolean, number
            type: this.type // the logic variables value
        };
    }
    get type() {
        return (this.latest.type) ?? this.previous.type ?? '';
    }
    /**
     * Value will be undefined if its been deleted. But false converts to an empty string.
     * @returns
     */
    get value() {
        return (this.latest.value ?? '').toString();
    }
}
exports.default = Logic;
