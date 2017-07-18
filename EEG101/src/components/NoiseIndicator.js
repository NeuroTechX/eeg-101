// NoiseIndicator.js
// An image of the EEG head diagram with current noisy channels indicated

import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";

export default class ElectrodeSelector extends Component {
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
        <Image
          source={require("../assets/electrodediagram.png")}
          style={styles.container}
        >
          <View style={styles.horizontalContainer}>
            {this.renderNoiseIcon("1")}
            {this.renderNoiseIcon("2")}
          </View>
          <View style={styles.horizontalLowerContainer}>
            {this.renderNoiseIcon("0")}
            {this.renderNoiseIcon("3")}
          </View>
        </Image>
      );
    } else return null;
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    container: {
      height: 100,
      width: 100,
      alignItems: "center",
      position: "absolute",
      right: 20,
      top: 20
    },

    horizontalContainer: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "center"
    },

    horizontalLowerContainer: {
      flexDirection: "row",
      flex: 1,
      marginLeft: -30,
      marginRight: -30,
      marginTop: -5
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
