// actions.js
// Where we build functions that interact with the Redux store

import Connector from './src/interface/Connector';
import {
	SET_CONNECTION_STATUS,
	SET_AVAILABLE_MUSES,
} from './constants';
import config from './config';

// Fns that return an action that interacts with the store
export const setConnectionStatus = (payload) => ({payload, type: SET_CONNECTION_STATUS});

const setAvailableMuses = (payload) => ({payload, type: SET_AVAILABLE_MUSES});

// sets museArray to list of paired Muse devices through Connector.getDevices promise return
function getDevices(dispatch) {

	return Connector.getDevices()
		.then((availableMuses) => {
			console.log('getDevices called, returned' + availableMuses);
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