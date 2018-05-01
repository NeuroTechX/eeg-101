// DataCollector.js
// Used to collect training data for the bci
// dynamic button and text element that has code moved from the orginal scene
// to make it more readable

import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Vibration
} from "react-native";
import Classifier from "../native/Classifier.js";
import Button from "../components/WhiteButton.js";
import I18n from "../i18n/i18n";
import DataCollectionIndicator from "../components/DataCollectionIndicator.js";
import * as colors from "../styles/colors";

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
      if (this.state.samples >= 10) {
        this.props.onComplete();
      }
    });
    setTimeout(() => Classifier.stopCollecting(), 20000);
  }

  // class 1 == off
  // class 2 == on

  render() {
    if (this.state.isCollecting) {
      return (
        <View style={styles.dataClassContainer}>
          <Text style={styles.body}>
            {I18n.t("collecting")}
          </Text>
          <DataCollectionIndicator noise={this.props.noise}
          />
        </View>
      );
    } else if (this.state.samples < 10 && this.state.hasCollected) {
      return (
        <View style={styles.dataClassContainer}>
          <Text style={styles.body}>
            {I18n.t("oopsYouOnly")}{" "}
            <Text style={{ fontWeight: "bold" }}>
              {this.state.samples}
            </Text>{" "}
            {I18n.t("epochsOfData")}
          </Text>
          <Button onPress={() => this.collectData()}>
            {I18n.t("trainCollect")}
          </Button>
        </View>
      );
    } else if (this.props.class === 1) {
      if (!this.state.hasCollected) {
        return (
          <View style={styles.dataClassContainer}>
            <Text style={styles.body}>
              {I18n.t("letsTeach2")} {this.props.bciAction}{" "}
              {I18n.t("eyesOpen")}
            </Text>
            <Button onPress={() => this.collectData()}>
              {I18n.t("trainCollect")}
            </Button>
          </View>
        );
      } else if (this.state.samples >= 10) {
        return (
          <View style={styles.dataClassContainer}>
            <Text style={styles.body}>
              {I18n.t("youveCollected")}{" "}
              <Text style={{ fontWeight: "bold" }}>
                {this.state.samples}
              </Text>{" "}
              {I18n.t("totalCleanData2")}
            </Text>
            <Button onPress={() => this.collectData()}>
              {I18n.t("trainCollectMore")}
            </Button>
          </View>
        );
      }
    } else if (this.props.class === 2) {
      if (!this.state.hasCollected) {
        return (
          <View style={styles.dataClassContainer}>
            <Text style={styles.body}>
              {I18n.t("letsTeach")} {this.props.bciAction} {I18n.t("closeYourEyes")}
            </Text>
            <Button onPress={() => this.collectData()}>
              {I18n.t("trainCollect")}
            </Button>
          </View>
        );
      } else if (this.state.samples >= 10) {
        return (
          <View style={styles.dataClassContainer}>
            <Text style={styles.body}>
              {I18n.t("youveCollected")}{" "}
              <Text style={{ fontWeight: "bold" }}>
                {this.state.samples}
              </Text>{" "}
              {I18n.t("totalCleanData")}
            </Text>
            <Button onPress={() => this.collectData()}>
              {I18n.t("trainCollectMore")}
            </Button>
          </View>
        );
      }
    }
    return (
      <View style={styles.dataClassContainer}>
        <Button onPress={() => this.collectData()}>
          {I18n.t("trainCollect")}
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
    color: colors.white,
    marginBottom: 30
  }
});
