// Button.js
// A blue, square button with white text that can be created with both onPress and disabled props
// onPress is an arrow function that can be pretty much anything
// disabled is a boolean that is passed to TouchableOpacity's built in disabled prop.

import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";
import * as colors from "../styles/colors";

export default class Button extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dynamicStyle = this.props.disabled ? styles.disabled : styles.active;
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        disabled={this.props.disabled}
      >
        <View style={dynamicStyle}>
          <Text
            style={styles.textStyle}
          >
            {this.props.children}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  {
    // Base styles
    textStyle: {
      color: "white",
      fontFamily: "Roboto-Bold",
      fontSize: 15
    },

    active: {
      justifyContent: "center",
      backgroundColor: colors.malibu,
      height: 50,
      margin: 5,
      padding: 5,
      alignItems: "center",
      elevation: 2,
      borderRadius: 4
    },

    disabled: {
      justifyContent: "center",
      backgroundColor: colors.heather,
      height: 50,
      margin: 5,
      padding: 5,
      alignItems: "center",
      elevation: 2,
      borderRadius: 4
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      active: {
        marginLeft: 20,
        marginRight: 20
      },
      disabled: {
        marginLeft: 20,
        marginRight: 20
      }
    }
  }
);
