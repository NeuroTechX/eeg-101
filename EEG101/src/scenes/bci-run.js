import React, { Component } from "react";
import {
  Text,
  View,
  ViewPagerAndroid,
  NativeEventEmitter,
  NativeModules,
  Vibration
} from "react-native";
import { connect } from "react-redux";
import config from "../redux/config";
import { MediaQueryStyleSheet } from "react-native-responsive";
import Torch from "react-native-torch";
import Classifier from "../interface/Classifier.js";
import LinkButton from "../components/LinkButton";
import PlayPauseButton from "../components/PlayPauseButton.js";
import PopUp from "../components/PopUp";
import I18n from "../i18n/i18n";
import BCIHistoryChart from "../components/BCIHistoryChart.js";
import NoiseIndicator from "../components/NoiseIndicator.js";
import * as colors from "../styles/colors";

function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
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
      data: new Array(30).fill(1),
      noise: [],
      isRunning: false
    };
  }

  updateData(data, message) {
    if (data.length >= 30) {
      data.shift();
    }
    data.push(message);
    return data;
  }

  componentDidMount() {
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
        //Torch.switchState(false);
      });
    } else {
      // Vibration action
      const vibrationListener = new NativeEventEmitter(
        NativeModules.Classifier
      );
      this.predictSubscription = vibrationListener.addListener(
        "PREDICT_RESULT",
        message => {
          if (message == 2) {
            Vibration.vibrate([0, 1100], true);
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
          if (Object.keys(message).length >= 1) {
            Vibration.cancel();
          }
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
          <BCIHistoryChart
            data={this.state.data}
            width={this.props.dimensions.width}
            height={this.props.dimensions.height}
          />
          <View style={styles.noiseView}>
            <NoiseIndicator noise={this.state.noise} width={100} height={100} />
          </View>
        </View>
        <Text style={styles.currentTitle}>
          {I18n.t("bciRunSlideTitle")}
        </Text>
        <ViewPagerAndroid style={styles.viewPager} initialPage={0}>
          <View style={styles.pageStyle}>
            <View style={styles.buttonView}>
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
                size={80}
              />
            </View>
            <View
              style={styles.buttonContainer}
            >
              <View style={styles.buttonFlex}>
                <LinkButton path="/end">
                  {I18n.t("endEeg101")}
                </LinkButton>
              </View>
              <View style={styles.buttonFlex}>
                <LinkButton path="/bciTrain">
                  {I18n.t("retrainBci")}
                </LinkButton>
              </View>
            </View>
          </View>
        </ViewPagerAndroid>
        <PopUp
          onClose={() => this.props.history.push("/connectorOne")}
          visible={
            this.props.connectionStatus === config.connectionStatus.DISCONNECTED
          }
          title={I18n.t("museDisconnectedTitle")}
        >
          {I18n.t("museDisconnectedDescription")}
        </PopUp>
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
      color: colors.skyBlue
    },

    classText: {
      textAlign: "center",
      margin: 15,
      lineHeight: 50,
      color: colors.white,
      fontFamily: "Roboto-Black",
      fontSize: 48
    },

    body: {
      fontFamily: "Roboto-Light",
      color: colors.black,
      fontSize: 19,
      textAlign: "center"
    },

    container: {
      backgroundColor: colors.white,
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch"
    },

    graphContainer: {
      backgroundColor: colors.skyBlue,
      flex: 4
    },

    header: {
      fontFamily: "Roboto-Bold",
      color: colors.black,
      fontSize: 20
    },

    buttonView: { padding: 40 },

    noiseView: { position: "absolute", top: 30, right: 30 },

    buttonContainer: { flexDirection: "row", justifyContent: "space-around" },

    buttonFlex: {flex: 1},

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
