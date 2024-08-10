"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const weather_1 = __importDefault(require("../entity/weather")); /**/
const watcher_1 = __importDefault(require("../watcher"));
// {
//     message: 'The weather in Glenroy is now 9°C with broken clouds (79% humidity : 1.041hPa)',
//     level: 'debug',
//     publish: false,
//     detail: {
//       temperature: 9,
//       humidity: 79,
//       pressure: 1.041,
//       state: 'broken clouds'
//     },
//     meta: {
//       id: 803,
//       name: 'Glenroy',
//       action: 'initialise',
//       entity: 'weather',
//       fields: [],
//       reason: 'none',
//       timestamp: 1720184704004
//     }
//   }
class Weather extends watcher_1.default {
    /**
     * Set the alias and call the parent
     */
    constructor(api, flows, log) {
        super(api, flows, {
            // @ts-expect-error athom definition issue
            manager: api.weather,
            triggers: flows.triggers.weather,
            entity: weather_1.default,
            listener: 'weather',
            log: log
        });
        this.initListeners = async () => {
            setTimeout(this.refresh.bind(this), 10000);
        };
        /**
         * Assign the values from the manager
         * @returns
         */
        this.getValues = async () => {
            return [await this.alias.manager.getWeather()];
        };
    }
    /**
     * The weather endpoint is rate limited 20 times per minute, 100 calls per hour and max 300 calls per day
     */
    async refresh() {
        try {
            let weather = (await this.alias.manager.getWeather());
            await this.trigger('update', weather);
        }
        catch (e) {
            console.log('--Weather Error--', e);
            console.error(e);
        }
        setTimeout(this.refresh.bind(this), 60000 * 15);
    }
}
exports.default = Weather;
