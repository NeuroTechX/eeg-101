// ElectrodeSelector.js
// An interactive widget with a diagram of electrode positions that allows the user to specify data source
// Head diagram image is split up into 4 equal-sized TouchableOpacitys, each of which changes the inherited channelOfInterest prop to a different value

import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { MediaQueryStyleSheet} from 'react-native-responsive';

export default class ElectrodeSelector extends Component {
	constructor(props) {
		super(props);

		this.state = {
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
      <View style={styles.container}>
			<ImageBackground source={this.state.image} style={styles.image}>
				<View style={styles.horizontalContainer}>
					<TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => {this.touch(2)}}/>
					<TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => {this.touch(3)}}/>
				</View>
				<View style={styles.horizontalContainer}>
					<TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => {this.touch(1)}}/>
					<TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => {this.touch(4)}}/>
				</View>
			</ImageBackground>
    </View>
		);
	}
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    container: {
      flex: .5,
      width: 100,
      height: 100,
      alignItems: 'center',
    },
    image: {
      height: 100,
      width: 100,
      alignItems: 'center',
    },

    horizontalContainer: {
      flexDirection: 'row',
      flex: 1,
		},

		TouchableOpacityStyle: {
			flex: 1
		}
  },
	// Responsive styles
  {
    "@media (min-device-height: 700)": {
    	container: {
    		height: 200,
				width: 200,
			},
			image: {
				height: 200,
				width: 200,
				alignItems: 'center',
			},
    }
	});
