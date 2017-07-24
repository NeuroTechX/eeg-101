// WhiteButton.js
// A duplicate Button component for the early connector slides that is white instead of blue

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as colors from "../styles/colors";

export default class WhiteButton extends Component{
  constructor(props){
    super(props);
  }

	render() {
    const dynamicStyle = (this.props.disabled) ? styles.disabled: styles.active;
		return(
		<TouchableOpacity onPress={this.props.onPress} disabled={this.props.disabled}>
			<View style={dynamicStyle}>
          		<Text style={{color: colors.skyBlue, fontFamily: 'Roboto-Bold', fontSize: 15}}>{this.props.children}</Text>
        	</View>
		</TouchableOpacity>
		)
	}

};

const styles = StyleSheet.create({

active: {
  justifyContent: 'center',
  backgroundColor: colors.white,
  height: 50,
  margin: 5,
  padding: 5,
  alignItems: 'center',
  elevation: 2,
  borderRadius: 4,
  },

disabled: {
  justifyContent: 'center',
  backgroundColor: colors.faintBlue,
  height: 50,
  margin: 5,
  padding: 5,
  alignItems: 'center',
  borderRadius: 4,
  }
});
