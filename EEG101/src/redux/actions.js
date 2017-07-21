// actions.js
// Functions that interact with the Redux store.
import { DeviceEventEmitter } from 'react-native';
import Connector from '../interface/Connector';
import {
  SET_CONNECTION_STATUS,
  SET_GRAPHVIEW_DIMENSIONS,
  SET_BCI_ACTION,
  SET_OFFLINE_MODE,
  SET_MENU,
} from './actionTypes.js';
import config from './config';

// setConnectionStatus and setAvailableMuses pass a payload to the reducer. Both Fns have a type (defined in constants.js) that allows them to be handled properly
export const setConnectionStatus = (payload) => ({payload, type: SET_CONNECTION_STATUS});

export const setGraphViewDimensions = (payload) => ({payload, type: SET_GRAPHVIEW_DIMENSIONS});

export const setOfflineMode = (payload) => ({payload, type: SET_OFFLINE_MODE});

export const setBCIAction = (payload) => ({payload, type: SET_BCI_ACTION});

export const setMenu = (payload) => ({payload, type: SET_MENU});

export function getAndConnectToDevice() {

  return (dispatch) =>  {
    return Connector.getAndConnectToDevice()
    .then((isConnected) => {
      return isConnected
    }, (reason) => {
      return reason;
    })
    .catch((error) => {
      console.log(error);
      dispatch(setConnectionStatus(config.connectionStatus.DISCONNECTED));
    });
  }
}
