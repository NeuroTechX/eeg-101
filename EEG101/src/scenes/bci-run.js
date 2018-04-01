import React, { Component } from "react";
import { Text, View, ViewPagerAndroid } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { startBCI, stopBCI } from "../redux//actions";
import config from "../redux/config";
import { MediaQueryStyleSheet } from "react-native-responsive";
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
    bciAction: state.bciAction,
    noise: state.noise,
    classifierData: state.classifierData,
    isBCIRunning: state.isBCIRunning
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      startBCI,
      stopBCI
    },
    dispatch
  );
}

class BCIRun extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUp1Visible: false
    };
  }

  componentWillUnmount() {
    this.props.stopBCI();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.graphContainer}>
          <BCIHistoryChart
            data={this.props.classifierData}
            width={this.props.dimensions.width}
            height={this.props.dimensions.height}
          />
          <View style={styles.noiseView}>
            <NoiseIndicator noise={this.props.noise} width={100} height={100} />
          </View>
        </View>
        <Text style={styles.currentTitle}>{I18n.t("bciRunSlideTitle")}</Text>
        <ViewPagerAndroid style={styles.viewPager} initialPage={0}>
          <View style={styles.pageStyle}>
            <View style={styles.buttonView}>
              <PlayPauseButton
                onPress={() => {
                  if (this.props.isBCIRunning) {
                    this.props.stopBCI();
                  } else {
                    this.props.startBCI();
                  }
                  this.setState({ isRunning: !this.state.isRunning });
                }}
                isRunning={this.state.isRunning}
                size={80}
              />
            </View>
            <View style={styles.buttonContainer}>
              <View style={styles.buttonFlex}>
                <LinkButton path="/end">{I18n.t("endEeg101")}</LinkButton>
              </View>
              <View style={styles.buttonFlex}>
                <LinkButton path="/bciTrain">{I18n.t("retrainBci")}</LinkButton>
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

export default connect(mapStateToProps, mapDispatchToProps)(BCIRun);

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

    buttonFlex: { flex: 1 },

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
