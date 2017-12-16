// NoiseIndicator.js
// An image of the EEG head diagram with current noisy channels indicated

import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Image, ImageBackground } from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";

export default class NoiseIndicator extends Component {
  constructor(props) {
    super(props);
  }

  renderNoiseIcon(electrodeNumber) {
    if (this.props.noise.includes(electrodeNumber)) {
      return (
        <Image
          source={require("../assets/noise.png")}
          style={styles.image}
          resizeMode="contain"
        />
      );
    } else {
      return <View style={{ flex: 1 }} />;
    }
  }

  render() {
    if (this.props.noise.length !== 0) {
      return (
        <ImageBackground
          source={require("../assets/electrodediagram.png")}
          style={{height: this.props.height, width: this.props.width, alignSelf: 'center'}}
        >
          <View style={styles.horizontalContainer}>
            {this.renderNoiseIcon("1")}
            {this.renderNoiseIcon("2")}
          </View>
          <View style={styles.horizontalLowerContainer}>
            {this.renderNoiseIcon("0")}
            {this.renderNoiseIcon("3")}
          </View>
        </ImageBackground>
      );
    } else return null;
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {

    horizontalContainer: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "center"
    },

    horizontalLowerContainer: {
      flexDirection: "row",
      flex: 1,
    },

    image: {
      flex: 1,
      height: 30,
      width: 30
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      container: {
        height: 200,
        width: 200
      },
      image: {
        height: 40,
        width: 40
      }
    }
  }
);
