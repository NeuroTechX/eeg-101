// WhiteButton.js
// A duplicate button component for the early connector slides that is white instead of blue

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';


export default class WhiteButton extends Component{
  constructor(props){
    super(props);

  }

	render() {
    const dynamicStyle = (this.props.disabled) ? styles.disabled: styles.active;
		return(
		<TouchableOpacity onPress={this.props.onPress} disabled={this.props.disabled}> 
			<View style={dynamicStyle}>
          		<Text style={{color: '#6CCBEF', fontFamily: 'Roboto-Bold', fontSize: 15}}>{this.props.children}</Text>
        	</View>
		</TouchableOpacity>
		)
	}

};

const styles = StyleSheet.create({

active: {
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  height: 50,
  margin: 5,
  padding: 5,
  alignItems: 'center',
  },

disabled: {
  justifyContent: 'center',
  backgroundColor: '#94DAFA',
  height: 50,
  margin: 5,
  padding: 5,
  alignItems: 'center',
  }
});



