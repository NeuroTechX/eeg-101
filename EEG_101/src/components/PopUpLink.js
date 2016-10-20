// PopUpLink.js
// A string that will trigger the appearance of a PopUp
import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';


export default class PopUpLink extends Component{

  render() {
    return(
      <Text style={{color:'#484848', fontFamily: 'Roboto-Regular'}}
       onPress={this.props.onPress}
       hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
       >{this.props.children}</Text>
    );
  }
}