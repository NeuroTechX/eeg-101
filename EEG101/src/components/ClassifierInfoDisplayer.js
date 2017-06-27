// ClassifierInfoDisplayer
// Used to fit and display info from the Gaussian Naive Bayes Classifier

import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator
} from "react-native";
import Classifier from "../interface/Classifier.js";
import Button from "../components/Button.js";
import { MediaQueryStyleSheet } from "react-native-responsive";

export default class ClassifierInfoDisplayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFitting: false,
      score: "",
      counts: "",
      priors: "",
      means: "",
      variances: "",
      discrimPower: "",
      featureRanking: ""
    };
  }

  render() {
    if (this.state.score == "") {
      return (
        <View style={styles.classifierContainer}>
          <Button
            onPress={() => {
              this.setState({ isFitting: true });
              Classifier.fitWithScore(this.props.folds).then(promise => {
                this.setState(promise);
                this.setState({ isFitting: false });
                this.props.onComplete()
              });
            }}
          >
            Fit Classifier
          </Button>
        </View>
      );
    } else if (this.state.isFitting) {
      return (
        <View style={styles.classifierContainer}>
          <ActivityIndicator color={"#6CCBEF"} size={"large"} />
        </View>
      );
    } else {
      return (
        <View style={styles.classifierContainer}>
          <Text style={styles.body}>Score: {this.state.score}</Text>
          <Text style={styles.body}>Class Priors: {this.state.priors}</Text>
          <Text style={styles.body}>Feature Ranking: {this.state.featureRanking}</Text>
          <Button
            onPress={() => {
              this.setState({ isFitting: true });
              Classifier.fitWithScore(this.props.folds).then(promise => {
                this.setState(promise);
                this.setState({ isFitting: false });
                this.props.onComplete()
              });
            }}
          >
            Re-Fit
          </Button>
        </View>
      );
    }
  }
}

  const styles = StyleSheet.create({
    classifierContainer: {
      flex: 3,
      justifyContent: "center",
      alignItems: "center"
    },
  })
