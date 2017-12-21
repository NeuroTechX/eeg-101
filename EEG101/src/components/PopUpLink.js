// PopUpLink.js
// A string that will trigger the appearance of a PopUp
// onPress should change a parent component's popUpVisible prop to true

import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { MediaQueryStyleSheet} from 'react-native-responsive';
import * as colors from "../styles/colors";

export default class PopUpLink extends Component{

  render() {
    if(this.props.isWhite){
    return(
      <Text style={styles.whiteLink}
       onPress={this.props.onPress}
       hitSlop={styles.hitSlop}>
        {this.props.children}
      </Text>
    );
  }
  return(
    <Text style={styles.link}
     onPress={this.props.onPress}
     hitSlop={styles.hitSlop}>
      {this.props.children}
    </Text>
  );
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    link: {
      color: colors.skyBlue,
        fontFamily: 'Roboto-Medium',
        textDecorationLine: 'underline',
    },
    whiteLink: {
      color: colors.white,
        fontFamily: 'Roboto-Medium',
        textDecorationLine: 'underline',
    },
    hitSlop: {
      top: 20, bottom: 20, left: 20, right: 20
    }
  },
  // Responsive Styles
  {
    "@media (min-device-height: 700)": {
      hitSlop: {
        top: 40, bottom: 40, left: 40, right: 40
      }
    }
  }
);
