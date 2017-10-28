// reducer.js
// Our Redux reducer. Handles important global data such as Muse connection status

import config from "./config";
import {
  SET_CONNECTION_STATUS,
  SET_GRAPHVIEW_DIMENSIONS,
  SET_BCI_ACTION,
  SET_OFFLINE_MODE,
  SET_MENU,
  SET_MUSE_INFO,
  SET_AVAILABLE_MUSES,
  SET_NOTCH_FREQUENCY
} from "./actionTypes";

const initialState = {
  connectionStatus: config.connectionStatus.NOT_YET_CONNECTED,
  availableMuses: [],
  museInfo: {},
  graphViewDimensions: { x: 0, y: 0, width: 300, height: 250 },
  bciAction: "",
  isMenuOpen: false,
  isOfflineMode: false,
  notchFrequency: 60,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CONNECTION_STATUS:
      return {
        ...state,
        connectionStatus: action.payload,
        isOfflineMode: false
      };

    case SET_GRAPHVIEW_DIMENSIONS:
      return {
        ...state,
        graphViewDimensions: action.payload
      };

    case SET_BCI_ACTION:
      return {
        ...state,
        bciAction: action.payload
      };

    case SET_AVAILABLE_MUSES:
      return {
        ...state,
        availableMuses: action.payload
      };

    case SET_MUSE_INFO:
      return {
        ...state,
        museInfo: action.payload
      };

    case SET_OFFLINE_MODE:
      return {
        ...state,
        isOfflineMode: action.payload,
        connectionStatus: config.connectionStatus.NO_MUSES
      };

    case SET_MENU:
      return {
        ...state,
        isMenuOpen: action.payload
      };

    case SET_NOTCH_FREQUENCY:
      return {
        ...state,
        notchFrequency: action.payload
      };

    // ...other actions

    default:
      return state;
  }
}
