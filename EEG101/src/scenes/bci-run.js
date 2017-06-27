import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  Image,
  NativeEventEmitter,
  NativeModules,
  Vibration
} from "react-native";
import { connect } from "react-redux";
import config from "../redux/config";
import { MediaQueryStyleSheet } from "react-native-responsive";
import Torch from "react-native-torch";
import Classifier from "../interface/Classifier.js";
import Button from "../components/Button.js";
import LinkButton from "../components/LinkButton";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";
import I18n from "../i18n/i18n";

function mapStateToProps(state) {
  return {
    dimensions: state.graphViewDimensions,
    bciAction: state.bciAction
  };
}

class ClassifierRun extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUp1Visible: false,
      class: 2
    };
  }

  componentDidMount() {
    if (this.props.bciAction === config.bciAction.LIGHT) {
      const lightListener = new NativeEventEmitter(NativeModules.Classifier);
      this.predictSubscription = lightListener.addListener(
        "PREDICT_RESULT",
        message => {
          this.setState({ class: message });
          if (message == 1) {
            Torch.switchState(true);
          } else {
            Torch.switchState(false);
          }
        }
      );
      this.noiseSubscription = lightListener.addListener("NOISE", message => {
        this.setState({ class: "noise " + Object.keys(message) })
        Torch.switchState(false);
      }
      );
    } else {
      const vibrationListener = new NativeEventEmitter(NativeModules.Classifier);
      this.predictSubscription = vibrationListener.addListener(
        "PREDICT_RESULT",
        message => {
          this.setState({ class: message });
          if (message == 1) {
            Vibration.vibrate([0,1000], true)
          } else {
            Vibration.cancel()
          }
        }
      );
      this.noiseSubscription = vibrationListener.addListener("NOISE", message => {
        this.setState({ class: "noise " + Object.keys(message) })
        Vibration.cancel()
      }
      );
    }
    Classifier.runClassification();
  }

  componentWillUnmount() {
    this.predictSubscription.remove();
    this.noiseSubscription.remove();
    Classifier.stopCollecting();
    Classifier.reset();
    Torch.switchState(false);
    Vibration.cancel();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.graphContainer}>
          <Text style={styles.classText}>{this.state.class}</Text>
        </View>

        <Text style={styles.currentTitle}>{I18n.t("classifierTitle")}</Text>

        <ViewPagerAndroid style={styles.viewPager} initialPage={0}>
          <View style={styles.pageStyle}>
            <Text style={styles.header}>{I18n.t("tryingToUnderstand")}</Text>
            <Text style={styles.body}>
              {I18n.t("classifierReturnsDataset")}
            </Text>
            <LinkButton path="/bciTwo" replace={true}>{I18n.t("retrainLink")}</LinkButton>
          </View>

        </ViewPagerAndroid>

      </View>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    currentTitle: {
      marginLeft: 20,
      marginTop: 10,
      fontSize: 13,
      fontFamily: "Roboto-Medium",
      color: "#6CCBEF"
    },

    classText: {
      textAlign: "center",
      margin: 15,
      lineHeight: 50,
      color: "#ffffff",
      fontFamily: "Roboto-Black",
      fontSize: 48
    },

    body: {
      fontFamily: "Roboto-Light",
      color: "#484848",
      fontSize: 19
    },

    container: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch"
    },

    graphContainer: {
      backgroundColor: "#72c2f1",
      flex: 4,
      justifyContent: "center",
      alignItems: "stretch"
    },

    header: {
      fontFamily: "Roboto-Bold",
      color: "#484848",
      fontSize: 20
    },

    viewPager: {
      flex: 4
    },

    pageStyle: {
      padding: 20,
      alignItems: "stretch",
      justifyContent: "space-around"
    },

    image: {
      flex: 1,
      width: null,
      height: null
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      viewPager: {
        flex: 3
      },

      header: {
        fontSize: 30
      },

      currentTitle: {
        fontSize: 20
      },

      body: {
        fontSize: 25
      }
    }
  }
);
export default connect(mapStateToProps)(ClassifierRun);
