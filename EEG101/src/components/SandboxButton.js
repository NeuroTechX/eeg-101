// SandboxButton.js
// Dynamically-styled buttons for the SandBox Graph slide
// Unfilled buttons when unselected, and filled with color when active

import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";
import * as colors from "../styles/colors";

export default class SandboxButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dynamicButtonStyle = this.props.active
      ? styles.activeButton
      : styles.inactiveButton;
    const dynamicTextStyle = this.props.active
      ? styles.activeText
      : styles.inactiveText;
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        disabled={this.props.disabled}
      >
        <View style={dynamicButtonStyle}>
          <Text style={dynamicTextStyle}>{this.props.children}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  {
    // Base styles
    activeButton: {
      justifyContent: "center",
      backgroundColor: colors.englishBlue,
      borderColor: colors.heather,
      borderRadius: 4,
      height: 30,
      margin: 5,
      padding: 5,
      alignItems: "center",
      elevation: 3
    },

    inactiveButton: {
      justifyContent: "center",
      backgroundColor: colors.white,
      borderColor: colors.heather,
      borderRadius: 4,
      height: 30,
      margin: 5,
      padding: 5,
      alignItems: "center",
      elevation: 3
    },

    activeText: {
      color: colors.white,
      fontFamily: "Roboto-Regular",
      fontSize: 15
    },

    inactiveText: {
      color: colors.skyBlue,
      fontFamily: "Roboto",
      fontSize: 15
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      activeButton: {
        height: 50
      },
      inactiveButton: {
        height: 50
      },

      activeText: {
        fontSize: 20
      },

      inactiveText: {
        fontSize: 20
      }
    }
  }
);
