// PopUpLink.js
// A string that will trigger the appearance of a PopUp
// onPress should change a parent component's popUpVisible prop to true

import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';


export default class PopUpLink extends Component{

  render() {
    return(
      <Text style={{color: '#6CCBEF',
        fontFamily: 'Roboto-Medium',
        textDecorationLine: 'underline',}}
       onPress={this.props.onPress}
       hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
        {this.props.children}
      </Text>
    );
  }
}