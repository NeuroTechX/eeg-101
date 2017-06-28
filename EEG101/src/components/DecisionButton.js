// SandboxButton.js
// Dynamically-styled buttons for the SandBox Graph slide
// Unfilled buttons when unselected, and filled with color when active

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MediaQueryStyleSheet } from 'react-native-responsive';

export default class SandboxButton extends Component{
  constructor(props){
    super(props);

  }

  render() {
    const dynamicButtonStyle = (this.props.active) ? styles.activeButton: styles.inactiveButton;
    const dynamicTextStyle = (this.props.active) ? styles.activeText: styles.inactiveText;
    return(
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={dynamicButtonStyle}>
          <Text style={dynamicTextStyle}>{this.props.children}</Text>
        </View>
      </TouchableOpacity>
    )
  }

};

const styles = MediaQueryStyleSheet.create(
  {
    // Base styles
    activeButton: {
      justifyContent: 'center',
      backgroundColor: '#94DAFA',
      borderColor: '#484848',
      borderWidth: 2,
      height: 50,
      margin: 10,
      padding: 10,
      alignItems: 'stretch',
    },

    inactiveButton: {
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'gray',
      height: 50,
      margin: 10,
      padding: 10,
      alignItems: 'stretch',
    },

    activeText:{
      color: '#484848',
      fontFamily: 'Roboto-Regular',
      fontSize: 24
    },

    inactiveText:{
      color: 'gray',
      fontFamily: 'Roboto-Regular',
      fontSize: 24
    },
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      activeButton: {
        height: 50,
      },
      inactiveButton: {
        height: 50,
      },

      activeText:{
        fontSize: 25
      },

      inactiveText:{
        fontSize: 25
      },
    }
  });
