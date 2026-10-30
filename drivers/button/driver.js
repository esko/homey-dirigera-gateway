'use strict';

const DirigeraDriver = require('../DirigeraDriver');
const Utils = require('../../utils');
const { isButtonDevice } = require('../button-events');

module.exports = class DirigeraButtonDriver extends DirigeraDriver {

  async onPairListDevices() {
    if (!this.homey.app.isGatewayConnected()) {
      throw new Error('First go to Settings -> Apps -> IKEA DIRIGERA Gateway to configure.');
    }
    const devices = await this.homey.app.getDevices();
    return devices.filter(isButtonDevice).map(device => ({
      // Controller endpoints can be separate buttons. Never merge relationIds
      // or strip endpoint suffixes: remotePressEvent identifies the exact id.
      data: { id: device.id },
      name: device.attributes?.customName || device.attributes?.model || 'DIRIGERA button',
      capabilities: ['measure_battery'],
    })).sort(Utils._compareHomeyDevice);
  }
};
