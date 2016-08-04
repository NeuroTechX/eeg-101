'use strict';

import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { MuseListenerManager } from 'NativeModules';

let subscriptions = [];

const MuseListener = {
  museState: MuseListenerManager.DISCONNECTED,

  connect() {
    subscriptions.push(RCTDeviceEventEmitter.addListener(
      'museStatus',
      (status) => {
        this.museState = status;
        console.log(`Muse State: ${this.museState}`);
      }
    ));
    MuseListenerManager.connect();
  },

  receiveMuseData(callback) {
    subscriptions.push(RCTDeviceEventEmitter.addListener(
      'museRead',
      callback
    ));
  },

  showMusePicker() {
    MuseListenerManager.showPicker();
  }
};

module.exports = MuseListener;