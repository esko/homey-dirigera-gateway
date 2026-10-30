'use strict';

const DirigeraDevice = require('../DirigeraDevice');
const { getPressCard } = require('../button-events');

module.exports = class DirigeraButtonDevice extends DirigeraDevice {

  async onInit() {
    this._seenPressEvents = new Set();
    const devices = await this.homey.app.getDevices();
    const device = devices.find(candidate => candidate.id === this.getData().id);
    if (!device) {
      await this.setUnavailable('Button was not found on DIRIGERA');
      return;
    }
    await this.updateSettings(device);
    await this.updateCapabilities(device);
  }

  async updateCapabilities(device) {
    if (!device) return;
    if (device.isReachable === true) await this.setAvailable();
    if (device.isReachable === false) await this.setUnavailable('(temporary) unavailable');
    const battery = device.attributes?.batteryPercentage;
    if (Number.isFinite(battery) && battery >= 0 && battery <= 100) {
      await this.setCapabilityValue('measure_battery', battery);
    }
  }

  async onRemotePress(event) {
    const card = getPressCard(event);
    if (!card || event.data.id !== this.getData().id) return;
    this._seenPressEvents = this._seenPressEvents || new Set();
    // Suppress transport replays by event identity, never by click timing:
    // two fast single presses with different event ids must both fire.
    const eventId = typeof event.id === 'string' && event.id ? event.id : null;
    if (eventId && this._seenPressEvents.has(eventId)) return;
    if (eventId) {
      this._seenPressEvents.add(eventId);
      if (this._seenPressEvents.size > 128) {
        this._seenPressEvents.delete(this._seenPressEvents.values().next().value);
      }
    }
    await this.homey.flow.getDeviceTriggerCard(card).trigger(this, {}, {});
  }
};
