// ConnectorWidget.js
// An interface component with a picker and two buttons that handles connection to Muse devices
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Picker,
} from 'react-native';

import Connector from '../interface/Connector';

import Button from './Button';

const initString = 'Please pair a device';

export default class ConnectorWidget extends Component{
	  constructor(props) {
    super(props);
    
    // Call startConnector function in Java
    Connector.startConnector();

    // Initialize States
    this.state = {
    	connectionStatus: 'No Device Selected',
      selectedMuse: null,
      museArray: [initString],
    };
   
  }
  // Consider moving this function to Connector interface
  async getDevices() {
  	try {
  		const array = await Connector.getDevices();
  		this.setState({museArray: array});
  	}
  	catch (e) {console.error(e);}
  }

  async connectDevice() {
  	if (this.state.museArray.includes(initString)) {
  		this.setState({connectionStatus: 'No paired devices detected'});
  		return;
  	}
  	this.setState({connectionStatus: 'Connecting...'});
  	try {
  		// Bool will return true if Java connectDevice function returns with Muse in connected state;
  		// false if disconnected
  		const bool = await Connector.connectDevice(this.state.selectedMuse);
  		this.props.enableStartButton(!bool);
  		if (bool) {
  			this.setState({connectionStatus: 'Connected'});
  		} else {this.setState({connectionStatus: 'Disconnected'});}
  	}
  	catch (e) {console.error(e);}
  }
  
	render() {
		const dynamicTextStyle = (this.state.connectionStatus === 'Connected') ? styles.connected: styles.disconnected;
		return(
			<View style={styles.outerContainer}>
		
				<Picker style={styles.picker}
					selectedValue={this.state.selectedMuse}
					onValueChange={(muse) => {this.setState({selectedMuse: muse})}}>
					{this.state.museArray.map((name) => {return <Picker.Item value={name} label={name} key={name}/>})}
				</Picker>
	

				<View style={styles.buttonContainer}>

					<Button onPress={this.getDevices.bind(this)}>GET DEVICE</Button>
					<Button onPress={this.connectDevice.bind(this)}>CONNECT</Button>
				</View>
				<View style={styles.textContainer}>
					<Text style={dynamicTextStyle}>{this.state.connectionStatus}</Text>
				</View>
			</View>
		)
	}

};

const styles = StyleSheet.create({

	outerContainer: {
		flex: 3,
		margin: 40,
 	},

 	buttonContainer: {
 		flex: 2,
 		flexDirection: 'row',
 		justifyContent: 'center',
    alignItems: 'center',	
 	},

 	textContainer: {
 		flex: 2,
 		flexDirection: 'row',
 		justifyContent: 'space-around',
    alignItems: 'center',	
 	},

 	picker: {
 		backgroundColor: '#72C2F1',
 		color: 'white',	
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

 	}
});






