// DecisionButton.js
// Round, bordered buttons for choosing BCI action type

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MediaQueryStyleSheet } from 'react-native-responsive';
import * as colors from "../styles/colors";

export default class SandboxButton extends Component{
  constructor(props){
    super(props);

  }

  render() {
    const dynamicButtonStyle = (this.props.active) ? styles.activeButton: styles.inactiveButton;
    const dynamicTextStyle = (this.props.active) ? styles.activeText: styles.inactiveText;
    return(
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={[dynamicButtonStyle, {height: this.props.size, width: this.props.size}]}>
          {this.props.children}
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
      backgroundColor: colors.malibu,
      borderWidth: 2,
      borderColor: colors.black,
      elevation: 5,
      alignItems: 'center',
      borderRadius: 50,
    },

    inactiveButton: {
      justifyContent: 'center',
      backgroundColor: colors.white,
      borderWidth: 2,
      borderColor: colors.black,
      elevation: 5,
      alignItems: 'center',
      borderRadius: 50,
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
