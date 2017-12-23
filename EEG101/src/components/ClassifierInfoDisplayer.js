// ClassifierInfoDisplayer
// Used to fit and display info from the Gaussian Naive Bayes Classifier

import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import Classifier from "../native/Classifier.js";
import Button from "../components/WhiteButton.js";
import PopUpLink from "./PopUpLink.js";
import PopUp from "./PopUp.js";
import LinkButton from "./WhiteLinkButton.js";
import I18n from "../i18n/i18n";
import * as colors from "../styles/colors";

export default class ClassifierInfoDisplayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popUp1Visible: false,
      popUp2Visible: false,
      isFitting: false,
      score: "",
      featurePower: "",
    };
  }

  render() {
    if (this.state.score == "") {
      return (
        <View style={styles.classifierContainer}>
          <Text style={styles.body}>{I18n.t('nextTrain')}{" "}
            <PopUpLink isWhite={true} onPress={() => this.setState({ popUp1Visible: true })}>
              {I18n.t('classifierName')}
            </PopUpLink>{" "}{I18n.t('collectedData')}</Text>
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
            {I18n.t('trainClassifierButton')}
          </Button>
          <PopUp
            onClose={() => this.setState({ popUp1Visible: false })}
            image={require("../assets/gnb.png")}
            fullSizeImage={true}
            visible={this.state.popUp1Visible}
            title={I18n.t('classifierTitle2')}
          >
            {I18n.t('classifierPopUp')}
          </PopUp>
        </View>
      );
    } else if (this.state.isFitting) {
      return (
        <View style={styles.classifierContainer}>
          <ActivityIndicator color={colors.skyBlue} size={"large"} />
        </View>
      );
    } else {
      return (
        <View style={styles.classifierContainer}>
          <View style={{ flex: 0.5 }}>
            <Text style={styles.body}>
              <PopUpLink isWhite={true} onPress={() => this.setState({ popUp2Visible: true })}>
                {I18n.t('classifierAccuracy')}
              </PopUpLink>{" "}
              <Text style={{ fontWeight: "bold" }}>{Math.round(this.state.score * 1000) / 1000}</Text>
            </Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.body}>{I18n.t('classifierScore')}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <View style={{ flex: 1 }}>
              <LinkButton path="/bciRun"> {I18n.t('trainRunIt')} </LinkButton>
            </View>
            <View style={{ flex: 1 }}>
              <LinkButton path="/bciTrain"> {I18n.t('classifierReTrain')} </LinkButton>
            </View>
          </View>
          <PopUp
            onClose={() => this.setState({ popUp2Visible: false })}
            visible={this.state.popUp2Visible}
            title={I18n.t('crossValidationAcc')}
          >
            {I18n.t('crossValidationDefinition')}
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
    color: colors.white
  }
});
