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
      samples: 0,
      hasCollected: false
    };
  }

  collectData() {
    this.setState({ isCollecting: true });
    Classifier.collectTrainingData(this.props.class).then(promise => {
      Vibration.vibrate();
      this.setState({
        samples: promise,
        isCollecting: false,
        hasCollected: true
      });
      if (this.state.samples >= 15) {
        console.log("onComplete called");
        this.props.onComplete();
      }
    });
    setTimeout(() => Classifier.stopCollecting(), 20000);
  }

  // class 1 == on
  // class 2 == off

  render() {
    if (this.state.isCollecting) {
      return (
        <View style={styles.dataClassContainer}>
          <Text style={styles.body}>Collecting...</Text>
          <ActivityIndicator color={"#94DAFA"} size={"large"} />
        </View>
      );
    } else if (this.state.samples < 15 && this.state.hasCollected) {
      return (
        <View style={styles.dataClassContainer}>
          <Text style={styles.body}>
            Oops! You only collected <Text style={{fontWeight: 'bold'}}>{this.state.samples}</Text> epochs of data.
            {"\n"}{"\n"}
            Remember, it is important to discard epochs that contain too
            much noise in order to detect signals from the brain.
            Try again, ensuring that your headband is fitted correctly and
            that blinks and movement are kept to a minumum.
          </Text>
          <Button onPress={() => this.collectData()}>
            COLLECT
          </Button>
        </View>
      );
    } else if (this.props.class === 1) {
      if (!this.state.hasCollected) {
        return (
          <View style={styles.dataClassContainer}>
            <Text style={styles.body}>
              Now, let’s teach the algorithm the brain state you’ll use to
              turn
              the {this.props.bciAction} ON.
              {"\n"}{"\n"}
              Once again, you can try whatever you want. We recommend
              closing your eyes and relaxing. Click the button below to
              start recording another 30 seconds of data.
            </Text>
            <Button onPress={() => this.collectData()}>
              COLLECT
            </Button>
          </View>
        );
      } else if (this.state.samples >= 15) {
        return (
          <View style={styles.dataClassContainer}>
            <Text style={styles.body}>
              Awesome! You've collected <Text style={{fontWeight: 'bold'}}>{this.state.samples}</Text> epochs of clean
              data.
              {"\n"}{"\n"}
              The accuracy of machine learning is often dependent on the number
              of examples given to the algorithm. Consider collecting even more
              data to make this BCI as accurate as possible!
            </Text>
            <Button onPress={() => this.collectData()}>
              COLLECT
            </Button>
          </View>
        );
      }
    } else if (this.props.class === 2) {
      if (!this.state.hasCollected) {
        return (
          <View style={styles.dataClassContainer}>
            <Text style={styles.body}>
              Let's teach the algorithm which brain state you’ll use to keep
              the {this.props.bciAction} OFF.
              {"\n"}{"\n"}
              You can try whatever you
              want, but we
              recommend keeping your eyes open and concentrating. When you are
              ready, click to record 30 seconds of data.
            </Text>
            <Button onPress={() => this.collectData()}>
              COLLECT
            </Button>
          </View>
        );
      } else if (this.state.samples >= 15) {
        return (
          <View style={styles.dataClassContainer}>
            <Text style={styles.body}>
              Awesome! You've collected <Text style={{fontWeight: 'bold'}}>{this.state.samples}</Text> epochs of clean
              data.
              {"\n"}{"\n"}
              For this BCI, each epoch is one second long. Those with too much noise are discarded.
            </Text>
            <Button onPress={() => this.collectData()}>
              COLLECT
            </Button>
          </View>
        );
      }
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
    height: 300,
    alignItems: "stretch",
    justifyContent: "center"
  },

  body: {
    textAlign: "center",
    fontFamily: "Roboto-Light",
    fontSize: 18,
    color: "#484848",
    marginBottom: 30
  }
});
