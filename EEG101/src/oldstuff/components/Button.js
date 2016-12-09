// Button.js
// A blue, square button with white text that can be created with both onPress and disabled props
// onPress is an arrow function that can be pretty much anything
// disabled is a boolean that is passed to TouchableOpacity's built in disabled prop.

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';


export default class Button extends Component{
  constructor(props){
    super(props);

  }

	render() {
    const dynamicStyle = (this.props.disabled) ? styles.disabled: styles.active;
		return(
		<TouchableOpacity onPress={this.props.onPress} disabled={this.props.disabled}> 
			<View style={dynamicStyle}>
          		<Text style={{color: 'white', fontFamily: 'Roboto-Bold', fontSize: 15}}>{this.props.children}</Text>
        	</View>
		</TouchableOpacity>
		)
	}

};

const styles = StyleSheet.create({

active: {
  justifyContent: 'center',
  backgroundColor: '#94DAFA',
  height: 50,
  margin: 5,
  padding: 5,
  alignItems: 'center',
  },

disabled: {
  justifyContent: 'center',
  backgroundColor: '#b6bfcb',
  height: 50,
  margin: 5,
  padding: 5,
  alignItems: 'center',
  }
});



