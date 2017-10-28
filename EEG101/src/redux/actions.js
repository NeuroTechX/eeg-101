// actions.js
// Functions that interact with the Redux store.
import Connector from "../interface/Connector";
import {
  SET_CONNECTION_STATUS,
  SET_GRAPHVIEW_DIMENSIONS,
  SET_BCI_ACTION,
  SET_OFFLINE_MODE,
  SET_MENU,
  SET_MUSE_INFO,
  SET_AVAILABLE_MUSES,
  SET_NOTCH_FREQUENCY
} from "./actionTypes.js";
import config from "./config";

// setConnectionStatus and setGraphViewDimensions pass a payload to the reducer. Both Fns have a type (defined in constants.js) that allows them to be handled properly
export const setConnectionStatus = payload => ({
  payload,
  type: SET_CONNECTION_STATUS
});

export const setConnectedMuseInfo = payload => ({
  payload,
  type: SET_MUSE_INFO
});

export const setAvailableMuses = payload => ({
  payload,
  type: SET_AVAILABLE_MUSES
});

export const setGraphViewDimensions = payload => ({
  payload,
  type: SET_GRAPHVIEW_DIMENSIONS
});

export const setOfflineMode = payload => ({ payload, type: SET_OFFLINE_MODE });

export const setBCIAction = payload => ({ payload, type: SET_BCI_ACTION });

export const setMenu = payload => ({ payload, type: SET_MENU });

export const setNotchFrequency = payload => ({ payload, type: SET_NOTCH_FREQUENCY });

export function getMuses() {
  return dispatch => {
    return Connector.getMuses().then(
      resolveValue => dispatch(setAvailableMuses(resolveValue)),
      rejectValue => {
        if (rejectValue.code === config.connectionStatus.BLUETOOTH_DISABLED) {
          dispatch(
            setConnectionStatus(config.connectionStatus.BLUETOOTH_DISABLED)
          );
        } else {
          dispatch(setConnectionStatus(config.connectionStatus.NO_MUSES));
        }
        return dispatch(setAvailableMuses(new Array()))
      }
    );
  };
}
