// actions.js
// Functions that interact with the Redux store.
import Connector from "../native/Connector";
import Classifier from "../native/Classifier";
import { NativeModules, NativeEventEmitter, Vibration } from "react-native";
import Torch from "react-native-torch";
import {
  SET_CONNECTION_STATUS,
  SET_GRAPHVIEW_DIMENSIONS,
  SET_BCI_ACTION,
  SET_OFFLINE_MODE,
  SET_MENU,
  SET_MUSE_INFO,
  SET_AVAILABLE_MUSES,
  SET_NOTCH_FREQUENCY,
  SET_NOISE,
  UPDATE_CLASSIFIER_DATA,
  SET_NATIVE_EMITTER,
  START_BCI_RUNNING,
  STOP_BCI_RUNNING
} from "./actionTypes.js";
import config from "./config";

// --------------------------------------------------------------------------
// Action Creators

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

export const setNotchFrequency = payload => ({
  payload,
  type: SET_NOTCH_FREQUENCY
});

export const setNoise = payload => ({ payload, type: SET_NOISE });

export const updateClassifierData = payload => ({
  payload,
  type: UPDATE_CLASSIFIER_DATA
});

export const setNativeEventEmitter = payload => ({
  payload,
  type: SET_NATIVE_EMITTER
});

export const startBCIRunning = () => ({ type: START_BCI_RUNNING });

export const stopBCIRunning = () => ({ type: STOP_BCI_RUNNING });

// -----------------------------------------------------------------------------
// Actions

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
        return dispatch(setAvailableMuses(new Array()));
      }
    );
  };
}

export function initNativeEventListeners() {
  return (dispatch, getState) => {
    const nativeEventEmitter = new NativeEventEmitter(
      NativeModules.AppNativeEventEmitter
    );

    // Connection Status
    nativeEventEmitter.addListener("CONNECTION_CHANGED", params => {
      switch (params.connectionStatus) {
        case "CONNECTED":
          dispatch(setConnectionStatus(config.connectionStatus.CONNECTED));
          break;

        case "CONNECTING":
          dispatch(setConnectionStatus(config.connectionStatus.CONNECTING));
          break;

        case "DISCONNECTED":
        default:
          dispatch(setConnectionStatus(config.connectionStatus.DISCONNECTED));
          break;
      }
    });

    // Muse List
    nativeEventEmitter.addListener("MUSE_LIST_CHANGED", params => {
      dispatch(setAvailableMuses(params));
    });

    // Noise
    nativeEventEmitter.addListener("NOISE", message => {
      dispatch(setNoise(Object.keys(message)));
      if (getState().isBCIRunning && Object.keys(message).length > 0) {
        actionOff(getState().bciAction);
      }
    });

    // BCI Prediction
    nativeEventEmitter.addListener("PREDICT_RESULT", message => {
      if (getState().isBCIRunning) {
        if (message == 2) {
          actionOn(getState().bciAction);
        } else {
          actionOff(getState().bciAction);
        }
        dispatch(updateClassifierData(message));
        dispatch(setNoise([]));
      }
    });

    return dispatch(setNativeEventEmitter(nativeEventEmitter));
  };
}

export function startBCI() {
  return dispatch => {
    Classifier.runClassification();
    dispatch(startBCIRunning());
  };
}

export function stopBCI() {
  return (dispatch, getState) => {
    Classifier.stopCollecting();
    dispatch(stopBCIRunning());
    actionOff(getState().bciAction);
  };
}

// -------------------------------------------------------------------------
// Helper Methods

const actionOn = bciAction => {
  try {
    if (bciAction === config.bciAction.LIGHT) {
      Torch.switchState(true);
    } else if (bciAction === config.bciAction.VIBRATE) {
      Vibration.vibrate(500);
    }
  } catch (e) {
    console.log(e.message);
  }
};

const actionOff = bciAction => {
  try {
    if (bciAction === config.bciAction.LIGHT) {
      Torch.switchState(false);
    } else if (bciAction === config.bciAction.VIBRATE) {
      Vibration.cancel();
    }
  } catch (e) {
    console.log(e.message);
  }
};
