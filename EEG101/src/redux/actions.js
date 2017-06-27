// actions.js
// Where we store functions that interact with the Redux store.

import Connector from '../interface/Connector';
import {
  SET_CONNECTION_STATUS,
  SET_GRAPHVIEW_DIMENSIONS,
  SET_BCI_ACTION,
} from './constants';
import config from './config';

// setConnectionStatus and setAvailableMuses pass a payload to the reducer. Both Fns have a type (defined in constants.js) that allows them to be handled properly
export const setConnectionStatus = (payload) => ({payload, type: SET_CONNECTION_STATUS});

export const setGraphViewDimensions = (payload) => ({payload, type: SET_GRAPHVIEW_DIMENSIONS});

export const setBCIAction = (payload) => ({payload, type: SET_BCI_ACTION});

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
