// ConnectorWidget/component.js
// An interface component with a picker and two buttons that handles connection to Muse devices
import React, { Component } from 'react';
import {
  Text,
  View,
  DeviceEventEmitter,
  StyleSheet,
} from 'react-native';

import config from '../../../config'

import Connector from '../../interface/Connector';

import WhiteButton from '../WhiteButton'
export default class ConnectorWidget extends Component{
  constructor(props) {
    super(props);

    this.state = {
      listeners: [],
    };
  }
  // Call getAndConnectToDevice and register event listeners when component loads
  componentDidMount() {

    // Updates connection status if no Muses are found in getMuses call
    const noMuseListener = DeviceEventEmitter.addListener('NO_MUSES', (event) => {
      this.props.setConnectionStatus(config.connectionStatus.NO_MUSES);
    });

    // Updates connection status to represent temporary connecting state
    const connectionListener = DeviceEventEmitter.addListener('CONNECT_ATTEMPT', (event) => {
      this.props.setConnectionStatus(config.connectionStatus.CONNECTING);
    });

    this.setState({listeners: [noMuseListener, connectionListener]});
    this.props.getAndConnectToDevice();
  }

  componentWillUnmount() {
    this.state.listeners.forEach((listener) => listener.remove());
    Connector.stopConnector();
  }

	render() {
    // switch could also further functionality to handle multiple connection conditions
    switch(this.props.connectionStatus) {
      case config.connectionStatus.CONNECTED:
        connectionString = 'Connected';
        dynamicTextStyle = styles.connected;
        break;
      case config.connectionStatus.NO_MUSES:
        dynamicTextStyle = styles.noMuses;
        return(
          <View style={styles.container}>
            <Text style={dynamicTextStyle}>No Muses were detected.</Text>
            <Text style={styles.body}>We are working on an offline mode that should be avaible in early 2017!</Text>
            <WhiteButton onPress={()=>this.props.getAndConnectToDevice()}>SEARCH AGAIN</WhiteButton>
          </View>
        );
      case config.connectionStatus.CONNECTING:
        connectionString = 'Connecting...'
        dynamicTextStyle = styles.connecting;
        break;
      case config.connectionStatus.DISCONNECTED:
        connectionString = 'Searching for available Muses'
        dynamicTextStyle = styles.disconnected;
    }

		return(
				<View style={styles.textContainer}>
					<Text style={dynamicTextStyle}>{connectionString}</Text>
				</View>
		)
	}
};

const styles = StyleSheet.create({

 	container: {
 		flex: 2,
 		flexDirection: 'column',
 		justifyContent: 'space-around',
    alignItems: 'stretch',
    marginLeft: 50,
    marginRight: 50,
 	},

  textContainer: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: '#ffffff',
  },

  body: {
    fontFamily: 'Roboto-Light',
    fontSize: 15,
    margin: 20,
    color: '#ffffff',
    textAlign: 'center'
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

  noMuses: {
    fontFamily: 'Roboto-Light',
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
  },

  connecting: {
    fontFamily: 'Roboto-Light',
    fontSize: 20,
    color: '#42f4d9',
  }


});






