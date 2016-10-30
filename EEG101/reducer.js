// reducer.js
// Our Redux reducer. Handles the routing actions produced by react-native-router-flux
// For the current implementation of EEG, this will primarily handle isActive changes

import { ActionConst } from 'react-native-router-flux';
import config from './config';
import {
  SET_CONNECTION_STATUS,
  SET_AVAILABLE_MUSES,
} from './constants';

const initialState = {
  scene: {},
  availableMuses: [],
  hasSearchedForMuses: false,
  connectionStatus: config.connectionStatus.DISCONNECTED,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // focus action is dispatched when a new screen comes into focus
    case ActionConst.FOCUS:

      return {
        ...state,
        scene: action.scene,
      };

    case SET_AVAILABLE_MUSES:

      return {

        ...state,
        hasSearchedForMuses: true,
        availableMuses: action.payload,
      }

    case SET_CONNECTION_STATUS:

      return {
        ...state,
        connectionStatus: action.payload,
      }

    // ...other actions

    default:
      return state;
  }
}
