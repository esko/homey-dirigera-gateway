'use strict';

const PRESS_CARDS = Object.freeze({
  singlePress: 'button_single_press',
  doublePress: 'button_double_press',
  longPress: 'button_long_press',
});

function isButtonDevice(device) {
  return device && ['lightController', 'shortcutController'].includes(device.deviceType);
}

function getPressCard(event) {
  if (!event || event.type !== 'remotePressEvent'
    || !event.data || typeof event.data.id !== 'string' || !event.data.id) return null;
  return Object.prototype.hasOwnProperty.call(PRESS_CARDS, event.data.clickPattern)
    ? PRESS_CARDS[event.data.clickPattern] : null;
}

module.exports = { PRESS_CARDS, isButtonDevice, getPressCard };
