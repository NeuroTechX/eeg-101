import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  Image,
  NativeEventEmitter,
  NativeModules,
  Vibration,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import config from "../redux/config";
import { MediaQueryStyleSheet } from "react-native-responsive";
import { Link } from "react-router-native";
import Torch from "react-native-torch";
import Classifier from "../interface/Classifier.js";
import Button from "../components/Button.js";
import LinkButton from "../components/LinkButton";
import PlayPauseButton from "../components/PlayPauseButton.js";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";
import I18n from "../i18n/i18n";
import BCIHistoryChart from "../components/BCIHistoryChart.js";
import NoiseIndicator from "../components/NoiseIndicator.js";

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
      data: [1,1,1,1,1,1,1,1,1,1,1],
      noise: [],
      isRunning: false,
    };
  }

  updateData(data, message) {
    if (data.length >= 10) {
      data.shift();
    }
    data.push(message);
    return data;
  }

  componentDidMount() {
    Classifier.fitWithScore(6).then(promise => {
      this.setState(promise);
    });

    // Light action
    if (this.props.bciAction === config.bciAction.LIGHT) {
      const lightListener = new NativeEventEmitter(NativeModules.Classifier);
      this.predictSubscription = lightListener.addListener(
        "PREDICT_RESULT",
        message => {
          if (message == 2) {
            Torch.switchState(true);
          } else {
            Torch.switchState(false);
          }
          this.setState({
            data: this.updateData(this.state.data, message),
            noise: []
          });
        }
      );
      this.noiseSubscription = lightListener.addListener("NOISE", message => {
        this.setState({ noise: Object.keys(message) });
        Torch.switchState(false);
      });
    } else {
      const vibrationListener = new NativeEventEmitter(
        NativeModules.Classifier
      );

      // Vibration action
      this.predictSubscription = vibrationListener.addListener(
        "PREDICT_RESULT",
        message => {
          if (message == 2) {
            Vibration.vibrate([0, 1000], true);
          } else {
            Vibration.cancel();
          }
          this.setState({
            data: this.updateData(this.state.data, message),
            noise: []
          });
        }
      );
      this.noiseSubscription = vibrationListener.addListener(
        "NOISE",
        message => {
          this.setState({ noise: Object.keys(message) });
          Vibration.cancel();

        }
      );
    }
  }

  componentWillUnmount() {
    this.predictSubscription.remove();
    this.noiseSubscription.remove();
    Classifier.stopCollecting();
    Torch.switchState(false);
    Vibration.cancel();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.graphContainer}>
          <BCIHistoryChart data={this.state.data} width={this.props.dimensions.width} height={this.props.dimensions.height} />
          <NoiseIndicator noise={this.state.noise} width={this.props.dimensions.width} height={this.props.dimensions.height} />
        </View>
        <Text style={styles.currentTitle}>{I18n.t('bciRunSlideTitle')}</Text>
        <ViewPagerAndroid style={styles.viewPager} initialPage={0}>
          <View style={styles.pageStyle}>
            <PlayPauseButton
              onPress={() => {
                if (this.state.isRunning) {
                  Classifier.stopCollecting();
                } else {
                  Classifier.runClassification();
                }
                this.setState({ isRunning: !this.state.isRunning });
                Torch.switchState(false);
                Vibration.cancel();
              }}
              isRunning={this.state.isRunning}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <View style={{ flex: 1 }}>
                <LinkButton path="/end">
                  {I18n.t("endEeg101")}
                </LinkButton>
              </View>
              <View style={{ flex: 1 }}>
                <LinkButton path="/bciTrain">
                  {I18n.t("retrainBci")}
                </LinkButton>
              </View>
            </View>
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
      fontSize: 19,
      textAlign: "center"
    },

    container: {
      backgroundColor: "#ffffff",
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch"
    },

    graphContainer: {
      backgroundColor: "#72c2f1",
      flex: 4,
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
