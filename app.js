'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __importDefault(require("homey"));
const homey_api_1 = require("homey-api");
const winston_1 = __importDefault(require("winston"));
const node_1 = require("@logtail/node");
const winston_2 = require("@logtail/winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const app_1 = __importDefault(require("./lib/watcher/app"));
const alarm_1 = __importDefault(require("./lib/watcher/alarm"));
const capability_1 = __importDefault(require("./lib/watcher/capability"));
const device_1 = __importDefault(require("./lib/watcher/device"));
const flow_1 = __importDefault(require("./lib/watcher/flow"));
const logic_1 = __importDefault(require("./lib/watcher/logic"));
const mood_1 = __importDefault(require("./lib/watcher/mood"));
const user_1 = __importDefault(require("./lib/watcher/user"));
const weather_1 = __importDefault(require("./lib/watcher/weather"));
const zone_1 = __importDefault(require("./lib/watcher/zone"));
class Audit extends homey_1.default.App {
    constructor() {
        super(...arguments);
        this.settings = {};
    }
    /**
     * onInit is called when the app is initialized.
     */
    async onInit() {
        try {
            await this.initSettings();
            await this.initApi();
            await this.initLogger();
            await this.initFlows();
            await this.initWatchers();
            this.logger.alert("Audit Log has been initialized");
        }
        catch (e) {
            console.log('ERROR', e);
            this.error(e);
        }
    }
    async onUninit() {
        this.logger.alert("Audit Log has been destroyed");
    }
    /**
     * Set the default settinggs then check the system for any user overrides
     */
    async initSettings() {
        this.settings = {
            'console.enabled': true,
            'console.level': 'debug',
            'message.enabled': true,
            'message.level': 'debug',
            'detail.enabled': false,
            'detail.level': 'warning',
            'betterstack.enabled': false,
            'betterstack.level': 'debug',
            'betterstack.api': ''
        };
        // Getting the settings is a pain, we have to first get each of the keys and then request the values
        let keys = this.homey.settings.getKeys();
        if (keys.length) {
            for (const key of keys) {
                this.settings[key] = this.homey.settings.get(key);
            }
        }
    }
    /**
     * Create on first call
     */
    async initApi() {
        if (!this.api) {
            this.api = await homey_api_1.HomeyAPIV3Local.createAppAPI({
                homey: this.homey,
            });
        }
        return this.api;
    }
    async initLogger() {
        let key = this.homey.settings.get('betterstack.api');
        let betterstack = !(key == '' || typeof key == 'undefined' || key == null);
        const DateTime = () => {
            const tz = this.homey.clock.getTimezone();
            const now = new Date();
            let date = now.toLocaleString('en-CA', {
                timeZone: tz,
                hour12: false
            }).replace('T', ' ').replace(/-/g, '-').replace(/\./g, '.').replace(',', '');
            return (date + '.' + String(now.getMilliseconds()).padStart(3, '0'));
        };
        let ExceptionConsoleTransport = new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.errors({ stack: true }), winston_1.default.format.timestamp({ format: new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }), }), winston_1.default.format.align(), winston_1.default.format.prettyPrint(), winston_1.default.format.json()),
        });
        let ExceptionFileTransport = new winston_1.default.transports.File({ filename: '/userdata/exception.log' });
        let RejectionFileTransport = new winston_1.default.transports.File({ filename: '/userdata/rejection.log' });
        let ConsoleTransport = new winston_1.default.transports.Console({
            level: this.settings['console.level'],
            format: winston_1.default.format.combine(winston_1.default.format.label({ label: 'audit' }), winston_1.default.format.metadata(), winston_1.default.format.timestamp({ format: DateTime }), winston_1.default.format.align(), winston_1.default.format.prettyPrint(), winston_1.default.format.colorize({
                colors: {
                    debug: 'blue',
                    info: 'cyan',
                    notice: 'green',
                    warning: 'yellow',
                    error: 'red dim',
                    crit: 'red',
                    alert: 'magenta dim',
                    emerg: 'magenta'
                }
            }), winston_1.default.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`))
        });
        const logFormat = winston_1.default.format.printf(function (info) {
            return `${info.level}: ${JSON.stringify(info.metadata, null, 4)}\n`;
        });
        const DetailFileRotateTransport = new winston_daily_rotate_file_1.default({
            level: this.settings['detail.level'],
            filename: '/userdata/detail.%DATE%.log',
            datePattern: 'YYYYMMDD',
            zippedArchive: true,
            maxFiles: '3d',
            format: winston_1.default.format.combine(winston_1.default.format.label({ label: 'audit' }), winston_1.default.format.metadata({ fillExcept: ['_latest', '_previous'] }), winston_1.default.format.prettyPrint(), winston_1.default.format.timestamp({ format: DateTime }), winston_1.default.format.align(), winston_1.default.format.printf(info => `[${info.timestamp}] ${info.metadata.level}: ${info.metadata ? JSON.stringify(info.metadata, null, 2) : ''}`))
        });
        DetailFileRotateTransport.on('new', (newFilename) => {
            this.logger.crit('Log file ' + newFilename + ' created');
        });
        DetailFileRotateTransport.on('rotate', (oldFilename, newFilename) => {
            this.logger.crit('Log file rotating from ' + oldFilename + ' to ' + newFilename);
        });
        DetailFileRotateTransport.on('archive', (zipFileName) => {
            this.logger.crit('Log file archived to ' + zipFileName);
        });
        DetailFileRotateTransport.on('logRemoved', (removedFilename) => {
            this.logger.crit('Log file ' + removedFilename + 'removed');
        });
        const MessageFileRotateTransport = new winston_daily_rotate_file_1.default({
            filename: '/userdata/message.%DATE%.log',
            datePattern: 'YYYYMMDD',
            zippedArchive: true,
            maxFiles: '14d',
            level: this.settings['message.level'],
            format: winston_1.default.format.combine(winston_1.default.format.label({ label: 'audit' }), winston_1.default.format.prettyPrint(), winston_1.default.format.metadata({}), winston_1.default.format.timestamp({ format: DateTime }), winston_1.default.format.align(), winston_1.default.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`))
        });
        MessageFileRotateTransport.on('new', (newFilename) => {
            this.logger.crit('Log file ' + newFilename + ' created');
        });
        MessageFileRotateTransport.on('rotate', (oldFilename, newFilename) => {
            this.logger.crit('Log file rotating from ' + oldFilename + ' to ' + newFilename);
        });
        MessageFileRotateTransport.on('archive', (zipFileName) => {
            this.logger.crit('Log file archived to ' + zipFileName);
        });
        MessageFileRotateTransport.on('logRemoved', (removedFilename) => {
            this.logger.crit('Log file ' + removedFilename + 'removed');
        });
        let transports = [];
        let connected = await this.isConnected(key);
        if (this.settings['console.enabled']) {
            transports.push(ConsoleTransport);
        }
        if (this.settings['message.enabled']) {
            transports.push(MessageFileRotateTransport);
        }
        if (this.settings['detail.enabled']) {
            transports.push(DetailFileRotateTransport);
        }
        if (this.settings['betterstack.enabled']) {
            if (betterstack && connected) {
                transports.push(new winston_2.LogtailTransport(new node_1.Logtail(key), {
                    level: this.settings['betterstack.level'],
                }));
            }
        }
        // Create a Winston logger - passing in the Logtail transport
        this.logger = winston_1.default.createLogger({
            levels: winston_1.default.config.syslog.levels,
            exceptionHandlers: [ExceptionConsoleTransport, ExceptionFileTransport],
            rejectionHandlers: [RejectionFileTransport],
            transports: transports,
            // level: process.env.LOG_LEVEL || 'debug',
        });
        if (betterstack && connected) {
            this.logger.alert('BetterStack is connected');
        }
        else {
            this.logger.crit('BetterStack not connected');
        }
    }
    async isConnected(key) {
        return true;
        // try {
        // let trial = new Logtail(key)
        // await trial.log('Testing Connection')
        //
        // // return (trial.dropped === 0)
        // trial.log('Testing Connection').then((res: any) => {
        // }).catch((e) => {
        //     console.log('eeeeee', e)
        // }).finally(() => {
        //     trial.flush()
        //     console.log(trial)
        //     return (trial.dropped === 0)
        // })
        // } catch (e) {
        //     return false
        // }
        // return false
    }
    async initFlows() {
        this.flows = {
            triggers: {
                app: this.homey.flow.getTriggerCard('app'),
                alarm: this.homey.flow.getTriggerCard('alarm'),
                capabilities: {
                    other: this.homey.flow.getTriggerCard('capability_other'),
                    //   type: this.homey.flow.getTriggerCard('capability'),
                    dim: this.homey.flow.getTriggerCard('capability_dim'),
                    onoff: this.homey.flow.getTriggerCard('capability_onoff'),
                    light: this.homey.flow.getTriggerCard('capability_light'),
                    meter: this.homey.flow.getTriggerCard('capability_meter'),
                    measure: this.homey.flow.getTriggerCard('capability_measure'),
                    alarm: this.homey.flow.getTriggerCard('capability_alarm'),
                    vacuumcleaner: this.homey.flow.getTriggerCard('capability_vacuumcleaner'),
                    thermostat: this.homey.flow.getTriggerCard('capability_thermostat'),
                    target: this.homey.flow.getTriggerCard('capability_target'),
                    homealarm: this.homey.flow.getTriggerCard('capability_homealarm'),
                    volume: this.homey.flow.getTriggerCard('capability_volume'),
                    // channel: this.homey.flow.getTriggerCard('capability_channel'),
                    locked: this.homey.flow.getTriggerCard('capability_locked'),
                    lock: this.homey.flow.getTriggerCard('capability_lock'),
                    garagedoor: this.homey.flow.getTriggerCard('capability_garagedoor'),
                    windowcoverings: this.homey.flow.getTriggerCard('capability_windowcoverings'),
                    // button: this.homey.flow.getTriggerCard('capability_button'),
                    speaker: this.homey.flow.getTriggerCard('capability_speaker'),
                },
                device: this.homey.flow.getTriggerCard('device'),
                flow: this.homey.flow.getTriggerCard('flow'),
                mood: this.homey.flow.getTriggerCard('mood'),
                user: this.homey.flow.getTriggerCard('user'),
                logic: this.homey.flow.getTriggerCard('logic'),
                weather: this.homey.flow.getTriggerCard('weather'),
                zone: this.homey.flow.getTriggerCard('zone'),
            },
            actions: {
                simple: this.homey.flow.getActionCard('simple'),
                detail: this.homey.flow.getActionCard('detail'),
                json: this.homey.flow.getActionCard('json'),
            }
        };
        this.flows.actions.simple.registerRunListener(async (args, state) => {
            let data = args;
            let message = '';
            try {
                message = data.message;
                delete data.message; // it will concat the data message with the actual message
            }
            catch (error) {
                data = '';
            }
            this.logger.log(args.level, message, data);
        });
        this.flows.actions.detail.registerRunListener(async (args, state) => {
            try {
                let message = args.message;
                let level = args.level;
                delete args.message;
                delete args.level;
                let data = {
                    meta: {
                        action: 'run',
                        entity: 'flow',
                        id: this.flows.actions.detail.id,
                        reason: this.flows.actions.detail.type,
                        timestamp: Date.now()
                    },
                    detail: args
                };
                this.logger.log(level, message, data);
            }
            catch (error) {
                console.error(error);
            }
        });
        this.flows.actions.json.registerRunListener(async (args, state) => {
            let data = args.data;
            let message = '';
            try {
                data = JSON.parse(args.data);
                message = data.message;
                delete data.message; // it will concat the data message with the actual message
            }
            catch (error) {
                data = '';
            }
            console.log('flows.action.json', args.level, data);
            // {"result":true, "count":42, "message": "this is a message"}
            this.logger.log(args.level, message, data);
        });
        /**
         * args is the user input, for example { 'location': 'New York' }
         * state is the parameter passed in trigger() for example { 'location': 'Amsterdam' }
         */
        // this.flows.triggers.capabilities.type.registerRunListener(async (args, state) => {
        //   return args.type === state.type;  // If true, this flow should run
        // });
    }
    async initWatchers() {
        this.device = new device_1.default(this.api, this.flows, this.logger);
        await this.device.initialize();
        this.app = new app_1.default(this.api, this.flows, this.logger);
        this.app.initialize();
        this.alarm = new alarm_1.default(this.api, this.flows, this.logger);
        this.alarm.initialize();
        this.capability = new capability_1.default(this.api, this.flows, this.device, this.logger);
        this.capability.initialize();
        this.flow = new flow_1.default(this.api, this.flows, this.logger);
        this.flow.initialize();
        this.logic = new logic_1.default(this.api, this.flows, this.logger);
        this.logic.initialize();
        this.user = new user_1.default(this.api, this.flows, this.logger);
        this.user.initialize();
        // this.notification = new Notification(this.api, this.flows, this.logger)
        // this.notification.initialize()
        this.mood = new mood_1.default(this.api, this.flows, this.logger);
        this.mood.initialize();
        // this.logger.alert('The weather polling has been disabled')
        this.weather = new weather_1.default(this.api, this.flows, this.logger);
        this.weather.initialize();
        this.zone = new zone_1.default(this.api, this.flows, this.logger);
        this.zone.initialize();
    }
}
module.exports = Audit;
