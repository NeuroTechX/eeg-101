// DataCollector.js
// Used to collect training data for the bci
// dynamic button and text element that has code moved from the orginal scene
// to make it more readable

import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Vibration
} from "react-native";
import Classifier from "../interface/Classifier.js";
import Button from "../components/Button.js";
import { MediaQueryStyleSheet } from "react-native-responsive";

export default class DataCollector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCollecting: false,
      samples: 0
    };
  }

  collectData() {
    this.setState({ isCollecting: true });
    Classifier.collectTrainingData(this.props.class).then(promise => {
      Vibration.vibrate()
      this.setState({ samples: promise, isCollecting: false });
      if (this.state.samples >= 10) {
        console.log("onComplete called");
        this.props.onComplete();
      }
    });
    setTimeout(() => Classifier.stopCollecting(), 20000);
  }

  // TODO: Increase size of classifier image
  // Make it clear in lesson that classifier features are band powers extracted
  // Change classifier fit feedback

  render() {
    if (this.state.isCollecting) {
      return (
        <View style={styles.dataClassContainer}>
          <ActivityIndicator color={"#94DAFA"} size={"large"} />
        </View>
      );
    } else if (this.state.samples >= 1 && this.state.samples < 10) {
      return (
        <View style={styles.dataClassContainer}>
          <Text style={styles.body}>
            Oops! You only collected {this.state.samples} epochs of data. There
            may have been too much noise.
          </Text>
          <Button onPress={() => this.collectData()}>
            COLLECT MORE
          </Button>

        </View>
      );
    } else if (this.state.samples >= 10) {
      return (
        <View style={styles.dataClassContainer}>
          <Text style={styles.body}>
            Awesome! You've collected {this.state.samples} epochs of clean data
          </Text>
          <Button onPress={() => this.collectData()}>
            COLLECT MORE
          </Button>

        </View>
      );
    }
    return (
      <View style={styles.dataClassContainer}>
        <Button onPress={() => this.collectData()}>
          COLLECT
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // Base styles
  dataClassContainer: {
    height: 150,
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },

  body: {
    textAlign: 'center',
    fontFamily: "Roboto-Light",
    fontSize: 18,
    color: "#484848",
    },
});
