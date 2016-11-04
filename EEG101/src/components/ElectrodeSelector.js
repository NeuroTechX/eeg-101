// ElectrodeSelector.js
// An interactive widget with a diagram of electrode positions that allows the user to specify data source
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import Connector from '../interface/Connector';

export default class ElectrodeSelector extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedElectrode: 1,
			image: require('../assets/electrodediagram1.png')
		};
	}

	touch(electrode) {
		switch(electrode){
			case 1:
				this.setState({image: require('../assets/electrodediagram1.png')});
				this.props.channelOfInterest(1); 
				break;
			case 2:
				this.setState({image: require('../assets/electrodediagram2.png')});
				this.props.channelOfInterest(2); 
				break;
			case 3:
				this.setState({image: require('../assets/electrodediagram3.png')});
				this.props.channelOfInterest(3); 
				break;
			case 4:
				this.setState({image: require('../assets/electrodediagram4.png')});
				this.props.channelOfInterest(4); 
				break;
		}
	}

	render() {
		return (
			<Image source={this.state.image} 
			style={styles.container}>
				<View style={styles.horizontalContainer}>
					<TouchableOpacity style={{flex:1}} onPress={() => {this.touch(2)}}></TouchableOpacity>
					<TouchableOpacity style={{flex:1}} onPress={() => {this.touch(3)}}></TouchableOpacity>
				</View>
				<View style={styles.horizontalContainer}>
					<TouchableOpacity style={{flex:1}} onPress={() => {this.touch(1)}}></TouchableOpacity>
					<TouchableOpacity style={{flex:1}} onPress={() => {this.touch(4)}}></TouchableOpacity>
				</View>
			</Image>
		);
	}
}

const styles = StyleSheet.create({
 
  container: {
  	height: 100,
  	width: 100,
  	alignItems: 'center',
  },

  horizontalContainer: {
  	flexDirection: 'row',
  	flex:1,
  }
    
});