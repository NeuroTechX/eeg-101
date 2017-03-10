// PopUpLink.js
// A string that will trigger the appearance of a PopUp
// onPress should change a parent component's popUpVisible prop to true

import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { MediaQueryStyleSheet} from 'react-native-responsive';

export default class PopUpLink extends Component{

  render() {
    return(
      <Text style={{color: '#6CCBEF',
        fontFamily: 'Roboto-Medium',
        textDecorationLine: 'underline',}}
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