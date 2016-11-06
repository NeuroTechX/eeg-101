// actions.js
// Where we build functions that interact with the Redux store.

import Connector from './src/interface/Connector';
import {
	SET_CONNECTION_STATUS,
	SET_AVAILABLE_MUSES,
} from './constants';
import config from './config';

// setConnectionStatus and setAvailableMuses pass a payload to the reducer. Both Fns have a type (defined in constants.js) that allows them to be handled properly
export const setConnectionStatus = (payload) => ({payload, type: SET_CONNECTION_STATUS});

export const setAvailableMuses = (payload) => ({payload, type: SET_AVAILABLE_MUSES});

// sets museArray to list of paired Muse devices through Connector.getDevices promise return
function getDevices(dispatch) {

	return Connector.getDevices()
		.then((availableMuses) => {
			dispatch(setAvailableMuses(availableMuses));
			return availableMuses;
		});
}

// Initiates connection attempt to first paired Muse
function connectToDevice(dispatch) {

	dispatch(setConnectionStatus(config.connectionStatus.CONNECTING));
	return Connector.connectDevice()
		.then((isConnected) => {return isConnected});
}

// calls getDevices and connectToDevice 5 times in a row
export function getAndConnectToDevice(timesCalled) {

	if (!timesCalled) {
        timesCalled = 0;
    }

	return (dispatch) => {
		return getDevices(dispatch)
			.then(() => connectToDevice(dispatch))
			.then((isConnected) => {

				if (!isConnected && timesCalled < 5) {
        	return getAndConnectToDevice(timesCalled + 1)(dispatch);
        }

        return;
			})
			.catch((error) => {
				console.log(error);
				dispatch(setConnectionStatus(config.connectionStatus.DISCONNECTED));
			});
	}
}