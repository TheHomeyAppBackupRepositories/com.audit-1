"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = __importDefault(require("../entity"));
/**
 "75585c62-b92c-4452-934b-5abb30c0f8bf": {
        "id": "75585c62-b92c-4452-934b-5abb30c0f8bf",
        "name": "Dark",
        "preset": null,
        "zone": "f4b5ef17-1b4b-4546-82c7-a511d1cf9459",
        "devices": {
            "0dd64cd5-b1c6-45d8-9775-0178e9a43183": {
                "state": {
                    "onoff": false,
                    "dim": 1,
                    "light_mode": "temperature",
                    "light_temperature": 0.88,
                    "light_hue": 0,
                    "light_saturation": 0
                }
            }
        }
    },
 */
class Mood extends entity_1.default {
    async parse() {
        await super.parse();
        this.object.detail = {};
        // console.log(this.latest)
    }
    /**
     * Returns an alphabetical array of the properties which have changed
     * @todo make alphabetical
     */
    get fields() {
        return this.difference(this.convert(this.previous), this.convert(this.latest), ['usage']).sort();
    }
    /**
     * Returns the (human) description of what happened.
     * This does not persist and will change on each event
     */
    get message() {
        let reason = this.reason;
        if (reason == 'name' || reason == 'rename') {
            return this.previous.name + ' has been renamed to ' + this.latest.name + '';
        }
        if (reason == 'enabled' || reason == 'disabled') {
            return this.latest.name + ' has been ' + reason;
        }
        if (reason == 'time') {
            return this.latest.name + ' time has been updated from ' + this.previous.time + ' to ' + this.latest.time;
        }
        return super.message;
    }
}
exports.default = Mood;
