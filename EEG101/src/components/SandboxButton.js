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
    return(
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={dynamicButtonStyle}>
          <Text style={styles.text}>{this.props.children}</Text>
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

      height: 30,
      margin: 5,
      padding: 5,
      alignItems: 'stretch',
      elevation: 3,
    },

    inactiveButton: {
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      borderColor: 'gray',
      height: 30,
      margin: 5,
      padding: 5,
      alignItems: 'stretch',
      elevation: 3,
    },

    text:{
      color: '#484848',
      fontFamily: 'Roboto-Regular',
      fontSize: 15
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
