// ConnectorWidget.js
// An interface component with a picker and two buttons that handles connection to Muse devices
import React, { Component } from 'react';
import {
  Text,
  View,
  DeviceEventEmitter,
  StyleSheet,
} from 'react-native';
import config from '../../../config'
import Button from '../Button';

export default class ConnectorWidget extends Component{
  constructor(props) {
    super(props);
  }
  // Call getAndConnectToDevice and register event listeners when component loads
  componentDidMount() {
    DeviceEventEmitter.addListener('MUSES FOUND', (event) => {
      console.log("device found");
    });
    DeviceEventEmitter.addListener('CONNECT ATTEMPT', (event) => {
      console.log("attempting to connect");
    });
    DeviceEventEmitter.addListener('CONNECTED', (event) => {
      console.log("connection success");
    });
    DeviceEventEmitter.addListener('DISCONNECTED', (event) => {
      console.log("connection didn't work");
    });
    this.props.getAndConnectToDevice();
  }

	render() {
    // initialize aspects of dynamic connection message
    let connectionString = 'Connecting...'
    let dynamicTextStyle = styles.connecting;

    // switch could also further functionality to handle multiple connection conditions
    switch(this.props.connectionStatus) {
      case config.connectionStatus.CONNECTED:
        connectionString = 'Connected';
        dynamicTextStyle = styles.connected;
        break;
    }

		return(
				<View style={styles.textContainer}>
					<Text style={dynamicTextStyle}>{connectionString}</Text>
				</View>
		)
	}
};

const styles = StyleSheet.create({

 	textContainer: {
 		flex: 1,
 		flexWrap: 'wrap',
 		justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: '#ffffff',
 	},

 	connected: {
 		fontFamily: 'Roboto-Light',
 		fontSize: 20,
 		color: '#0ef357',
 	},

 	disconnected: {
 		fontFamily: 'Roboto-Light',
 		fontSize: 20,
 		color: '#f3410e',
    textAlign: 'center',
 	},

  connecting: {
    fontFamily: 'Roboto-Light',
    fontSize: 20,
    color: '#42f4d9',
  }


});






