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
  // Need to make this disableable. Example here: https://github.com/CodeKoalas/react-router-native-button/blob/master/index.js

	render() {
    const dynamicStyle = (this.props.disabled) ? styles.disabled: styles.active;
		return(
      <Link
        to={this.props.path}
        replace={false}
        component={TouchableOpacity}
      >
  			<View style={dynamicStyle}>
            		<Text style={{color: colors.white, fontFamily: 'Roboto-Bold', fontSize: 15}}>{this.props.children}</Text>
          	</View>
		</Link>
		)
	}

};

const styles = StyleSheet.create({
  // Base styles
  active: {
    justifyContent: 'center',
    backgroundColor: colors.skyBlue,
    height: 50,
    margin: 5,
    padding: 5,
    alignItems: 'center',
    elevation: 2,
    borderRadius: 4,
    },

  disabled: {
    justifyContent: 'center',
    backgroundColor: colors.heather,
    height: 50,
    margin: 5,
    padding: 5,
    alignItems: 'center',
    borderRadius: 4,
    }
});
