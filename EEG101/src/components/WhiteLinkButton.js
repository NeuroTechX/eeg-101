// LinkButton.js
// A React Router Link styled as a nice white button

import React, { Component } from 'react';
import { Link } from 'react-router-native';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as colors from "../styles/colors";

export default class WhiteButton extends Component{
  constructor(props){
    replace = true;
    super(props);
  }

	render() {
    const dynamicStyle = (this.props.disabled) ? styles.disabled: styles.active;
		return(
      <Link
        to={this.props.path}
        replace={this.props.replace}
        component={TouchableOpacity}
      >
  			<View style={dynamicStyle}>
            		<Text style={{color: '#6CCBEF', fontFamily: 'Roboto-Bold', fontSize: 15}}>{this.props.children}</Text>
          	</View>
		</Link>
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
  backgroundColor: colors.skyBlue,
  height: 50,
  margin: 5,
  padding: 5,
  alignItems: 'center',
  borderRadius: 4,
  }
});
