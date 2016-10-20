// Button.js
// A button to click
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
          		<Text style={{color: 'white', fontFamily: 'Roboto-Bold',}}>{this.props.children}</Text>
        	</View>
		</TouchableOpacity>
		)
	}

};

const styles = StyleSheet.create({

active: {
  justifyContent: 'center',
  backgroundColor: '#72C2F1',
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



