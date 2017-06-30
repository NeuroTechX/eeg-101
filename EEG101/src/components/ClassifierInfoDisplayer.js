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
import { Link } from "react-router-native";
import PopUpLink from "./PopUpLink.js";
import PopUp from "./PopUp.js";
import LinkButton from "./LinkButton.js";

export default class ClassifierInfoDisplayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popUp1Visible: false,
      popUp2Visible: false,
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
          <Text style={styles.body}>
            Next, train the{" "}
            <PopUpLink onPress={() => this.setState({ popUp1Visible: true })}>
              classifier
            </PopUpLink>{" "}
            on your data to distinguish between your brain states.
            {"\n"}{"\n"}
            The data you've collected is simply the powers of the
            different brain waves (δ, θ, α, β) for each electrode in each epoch
            you collected
          </Text>
          <Button
            onPress={() => {
              this.setState({ isFitting: true });
              Classifier.fitWithScore(this.props.folds).then(promise => {
                this.setState(promise);
                this.setState({ isFitting: false });
                this.props.onComplete();
              });
            }}
          >
            TRAIN CLASSIFIER
          </Button>
          <PopUp
            onClose={() => this.setState({ popUp1Visible: false })}
            image={require("../assets/gnb.png")}
            fullSizeImage={true}
            visible={this.state.popUp1Visible}
            title="Classifier"
          >
            A classifier is a type of machine learning algorithm that learns to
            distinguish between two or more groups by looking at relevant
            features
            of these groups. The classifier that we are training here uses the
            Gaussian Naive Bayes technique to estimate the probability that a
            data
            point belongs to two distinct normal distributions.

            Image from Raizada and Lee, 2013
          </PopUp>
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
          <Text style={styles.body}>
            <PopUpLink onPress={() => this.setState({ popUp2Visible: true })}>
              Accuracy:
            </PopUpLink>{" "}
            <Text style={{ fontWeight: "bold" }}>{this.state.score}</Text>
          </Text>
          <Text style={styles.body}>
            This score represents how well the classifier is able to
            distinguish between the two brain states based on the data you
            collected.
            {"\n"}{"\n"}
            If you are happy with your classifier's score you can run your BCI in
            real-time! Otherwise, you can start over with new data
          </Text>
          <LinkButton path="/bciRun"> RUN IT! </LinkButton>
          <PopUp
            onClose={() => this.setState({ popUp2Visible: false })}
            visible={this.state.popUp2Visible}
            title={"Cross-validation accuracy"}
          >
            Cross-validation is a technique to evaluate the accuracy of
            predictive algorithms by breaking up an original set of example
            data into a training set and a test set. The algorithm is trained on
            this training set and scored on how well it predicts the values of
            the test set. In k-fold cross-validation, which this BCI uses, this
            process is repeated a number of times with different randomly
            selected subsamples of data each time.
          </PopUp>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  classifierContainer: {
    height: 350,
    alignItems: "stretch",
    justifyContent: "space-around"
  },

  body: {
    textAlign: "center",
    fontFamily: "Roboto-Light",
    fontSize: 18,
    color: "#484848"
  }
});
