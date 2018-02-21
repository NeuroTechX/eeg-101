// WhiteButton.js
// A duplicate Button component that has a white bg instead of blue

import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";

import * as colors from "../styles/colors";

export default class WhiteButton extends Component {
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
          <Text style={styles.textStyle}>{this.props.children}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  {
    textStyle: {
      color: colors.skyBlue,
      fontFamily: "Roboto-Bold",
      fontSize: 15
    },

    active: {
      justifyContent: "center",
      backgroundColor: colors.white,
      height: 50,
      margin: 5,
      padding: 5,
      alignItems: "center",
      elevation: 2,
      borderRadius: 4
    },

    disabled: {
      justifyContent: "center",
      backgroundColor: colors.faintBlue,
      height: 50,
      margin: 5,
      padding: 5,
      alignItems: "center",
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
