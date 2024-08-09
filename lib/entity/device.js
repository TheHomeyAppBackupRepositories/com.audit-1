"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = __importDefault(require("../entity"));
/**
 Device {
  id: 'ffc17df6-e354-4e96-9d88-475a9b488e7d',
  uri: 'homey:device:ffc17df6-e354-4e96-9d88-475a9b488e7d',
  driverId: 'homey:app:com.fibaro:FGS-223',
  ownerUri: 'homey:app:com.fibaro',
  name: 'Dressing Light',
  note: null,
  zone: '2d821372-45b9-4580-a80b-71893e772e6c',
  data: { token: 'a3e59d0d-3b26-443c-81a8-ac3f5d3e333e' },
  icon: null,
  iconOverride: null,
  iconObj: {
    id: '4ce818f4d0186f1eefb0dc30fdc11fb9',
    url: '/api/icon/3e1ea494-f9bf-41a4-9ce5-8636866f2aa1'
  },
  class: 'socket',
  virtualClass: 'light',
  capabilities: [ 'measure_power', 'meter_power', 'onoff' ],
  capabilitiesObj: {
    onoff: {
      id: 'onoff',
      type: 'boolean',
      iconObj: null,
      title: 'Turned on',
      getable: true,
      setable: true,
      insights: true,
      insightsTitleTrue: 'Turned on',
      insightsTitleFalse: 'Turned off',
      value: false,
      lastUpdated: 2024-01-07T13:08:26.444Z
    },
    meter_power: {
      id: 'meter_power',
      type: 'number',
      iconObj: null,
      title: 'Energy',
      getable: true,
      setable: false,
      insights: true,
      insightsTitleTrue: null,
      insightsTitleFalse: null,
      units: 'kWh',
      decimals: 2,
      value: 169.96,
      lastUpdated: 2024-01-07T09:39:17.352Z
    },
    measure_power: {
      id: 'measure_power',
      type: 'number',
      iconObj: null,
      title: 'Power',
      getable: true,
      setable: false,
      insights: true,
      insightsTitleTrue: null,
      insightsTitleFalse: null,
      units: 'W',
      decimals: 2,
      value: 0,
      lastUpdated: 2024-01-07T11:46:20.610Z
    }
  },
  settings: {
    zw_node_id: '38',
    zw_manufacturer_id: '271',
    zw_product_type_id: '515',
    zw_product_id: '12288',
    zw_device_class_basic: 'BASIC_TYPE_ROUTING_SLAVE',
    zw_device_class_generic: 'GENERIC_TYPE_SWITCH_BINARY',
    zw_device_class_specific: 'SPECIFIC_TYPE_POWER_SWITCH_BINARY',
    zw_firmware_id: '563',
    zw_application_version: '3',
    zw_application_sub_version: '3',
    zw_hardware_version: '3',
    zw_secure: '⨯',
    zw_battery: '⨯',
    zw_wakeup_interval: 0,
    zw_wakeup_enabled: false,
    zw_group_1: '1.1',
    zw_group_2: '1',
    zw_group_3: '1',
    zw_group_4: '1',
    zw_group_5: '1',
    switch_type: '2',
    save_state: true,
    power_report_interval: 3600,
    energie_report_interval: 3600,
    own_power: false,
    s1_power_report: 20,
    s1_kwh_report: 1,
    energy_alwayson: false,
    zw_configuration_value: '',
    homekit_exclude: false
  },
  settingsObj: true,
  flags: [ 'zwave', 'zwaveRoot' ],
  energy: null,
  energyObj: {
    W: 0,
    batteries: null,
    cumulative: null,
    generator: null,
    approximated: null
  },
  ui: {
    quickAction: 'onoff',
    components: [ [Object], [Object] ],
    componentsStartAt: 1
  },
  uiIndicator: null,
  available: true,
  unavailableMessage: null,
  warningMessage: null,
  ready: true,
  repair: false,
  unpair: true,
  images: [],
  color: '#000000'
}
 */
class Device extends entity_1.default {
    /**
     * Construct
     *
     * Use these parameter if you want to check the previous state for changes.
     *
     * @param action The action occurring
     * @param actual The Actual object, to perform methods upon
     * @param latest Latest property information
     * @param previous Previous (to the change) property information
     */
    constructor(action, actual, latest, previous) {
        super(action, actual, latest, previous);
        this.levels.error = ['warningMessage'];
        this.levels.alert = ['unavailableMessage'];
    }
    async parse() {
        await super.parse();
        this.object.detail.name = await this.getName();
        this.object.detail = {
            zone: await this.getZone()
        };
    }
    /**
       * Alias to which returns the objects properties
       */
    format() {
        let output = {
            message: this.object?.message,
            level: this.object?.level,
            publish: this.object?.publish,
            detail: this.object?.detail,
            meta: this.object?.meta
        };
        let debug = true;
        if (debug) {
            output.latest = this.latest;
        }
        if (debug) {
            output.previous = this.previous;
        }
        return output;
    }
    async getZone() {
        if (this.action !== 'delete') {
            let zone = await this.actual.getZone();
            return zone.name.toLowerCase();
        }
        return '';
    }
    async getName() {
        let zone = (await this.getZone()) ?? this.previous.zone;
        let name = this.latest.name ?? this.previous.name;
        name = name.trim();
        name = name.replace(zone, '');
        name = name.replace('🧷', '');
        name = name.replace('🔗', '');
        name = name.replace('📎', '');
        name = name.replace('⛓️', '');
        return name.trim();
    }
    /**
     * An OPINIONATED reason as to why the event is being published
     *
     * We want to simplify this values as much as possible, by removing chain reaction changes
     * This will be generally be the name of the main field which has been altered.
     * ie. I changed the time so I don't need to know that next occurrence changed.
     */
    get reason() {
        let output = super.reason;
        let fields = this.fields;
        if (fields.length == 2) {
            if (fields.includes('available') && fields.includes('unavailableMessage')) {
                return 'available';
            }
        }
        if (fields.includes('warningMessage')) {
            return 'warningMessage';
        }
        return output;
    }
    get level() {
        let reason = this.reason;
        let name;
        for (name in this.levels) {
            if (this.levels[name].includes(reason)) {
                return name;
            }
        }
        if (this.action == 'create' || this.action == 'delete') {
            return 'crit';
        }
        if (this.action == 'initialise') {
            return 'debug';
        }
        return 'notice';
    }
    // @todo update the get the zone name so we can send it to the log
    get message() {
        let fields = this.fields;
        let reason = this.reason;
        let name = this.getName();
        if (this.action !== 'update') {
            return 'Device "' + this.name + '" has been ' + this.action + 'd';
        }
        if (reason == 'name') {
            return this.previous.name + ' has been renamed to ' + this.name + '';
        }
        if (reason == 'zone') {
            return this.name + ' has been moved to a new zone';
        }
        if (reason == 'ready') {
            return this.latest.name + ' is ' + ((this.latest[fields[0]]) ? 'now' : 'no longer') + ' ' + fields[0];
        }
        if (reason == 'available') {
            return this.name + ' is ' + ((this.latest.available) ? 'now' : 'no longer') + ' available ' + ((this.latest.unavailableMessage) ? '[' + this.latest.unavailableMessage + ']' : '');
        }
        if (reason == 'settings') {
            return this.name + ' settings ' + (this.difference(this.previous[fields[0]], this.latest[fields[0]])).toString() + ' have been updated';
        }
        if (reason == 'warningMessage') {
            return this.name + ' has a warning "' + (this.latest.warningMessage) + '"';
        }
        if (fields.length === 1) {
            return this.name + ' ' + fields[0] + ' has been updated to ' + this.latest[fields[0]];
        }
        else {
            // When things go from unavailable to ready a bunch of other fields get added, ignore them and focus on the ready
            if (fields.includes('ready') && fields.includes('available')) {
                return this.name + ' is ' + ((this.latest.ready) ? 'now' : 'no longer') + ' ready and ' + ((this.latest.available) ? 'now' : 'no longer') + ' available';
            }
        }
        return this.name + ' has been ' + this.action + 'd';
    }
}
exports.default = Device;
