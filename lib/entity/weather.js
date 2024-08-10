"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = __importDefault(require("../entity"));
class Weather extends entity_1.default {
    /**
        city: 'Glenroy',
        country: 'AU',
        state: 'Light Intensity Drizzle',
        id: 300,
        screensaverId: 'rain',
        temperature: 18.9,
        temperatureUnits: '°C',
        humidity: 0.92,
        pressure: 1.017,
        when: '2024-01-03T13:46:44.587Z'
    */
    async parse() {
        super.parse();
        this.object.detail = {
            temperature: this.temperature, // The temperature of the location
            humidity: this.humidity, // The humidity of the location
            pressure: this.pressure, // The pressure of the location
            state: this.state // What is the weathers state, 'cloudy with rain'
        };
    }
    /**
     * Looks into the this.levels to see if the reason should have a specific level
     * defaults to info
     */
    // get level(): string {
    //     console.log('LEVEL')
    //     return (super.level == 'debug') ? 'notice' : super.level
    // }
    /**
     * The weather is based on the location.
     */
    get name() {
        return this.latest.city ?? '';
    }
    /**
     * Returns an alphabetical array of the properties which have changed
     * @todo make alphabetical
     */
    get fields() {
        return this.difference(this.convert(this.previous), this.convert(this.latest), ['screensaver', 'when']).sort();
    }
    /**
     * The description of the weather change
     * 'Cloudy and raining'
     */
    get description() {
        return this.latest.state;
    }
    /**
     * temperature of the weather
     */
    get temperature() {
        return this.latest.temperature ?? 0;
    }
    /**
     * Private temperature units, celsius
     * "°C"
     */
    get unit() {
        return this.latest.temperatureUnits ?? '';
    }
    /**
     * The humidity as a number out of 100
     */
    get humidity() {
        if (typeof this.latest.humidity != 'undefined') {
            return this.latest.humidity * 100;
        }
        return 0;
    }
    /**
     * The atmospheric pressure
     */
    get pressure() {
        return this.latest.pressure ?? 0;
    }
    /**
    * The atmospheric pressure
    */
    get state() {
        return this.latest.state ?? '';
    }
    /**
     * Log message
     */
    get message() {
        let fields = this.fields;
        if (fields.length == 1) {
            return 'The ' + fields[0] + ' in ' + this.latest.city + ' is now ' + this.latest[fields[0]];
        }
        return 'The weather in ' + this.latest.city + ' is now ' + this.temperature + this.unit + ' with ' + this.description + ' (' + this.humidity + '% humidity : ' + this.pressure + 'hPa)';
    }
    get publish() {
        return true;
    }
}
exports.default = Weather;
