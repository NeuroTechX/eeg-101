// reducer.js
// Our Redux reducer. Handles the routing actions produced by react-native-router-flux as well as Muse connection actions

import config from './config';
import {
  SET_CONNECTION_STATUS,
  SET_GRAPHVIEW_DIMENSIONS,
  SET_BCI_ACTION
} from './constants';

const initialState = {
  connectionStatus: config.connectionStatus.DISCONNECTED,
  availableMuses: false,
  graphViewDimensions: {x: 0, y: 0, width: 300, height: 250},
  bciAction: "",
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CONNECTION_STATUS:

      return {
        ...state,
        connectionStatus: action.payload
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

    // ...other actions

    default:
      return state;
  }
}
