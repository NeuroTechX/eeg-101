import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  Image,
  NativeEventEmitter,
  NativeModules,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setBCIAction } from "../redux/actions";
import config from "../redux/config.js";
import { MediaQueryStyleSheet } from "react-native-responsive";
import Classifier from "../interface/Classifier.js";
import DecisionButton from "../components/DecisionButton.js";
import SandboxButton from "../components/SandboxButton.js";
import Button from "../components/Button.js";
import LinkButton from "../components/LinkButton";
import MiniChart from "../components/MiniChart.js";
import I18n from "../i18n/i18n";

function mapStateToProps(state) {
  return {
    bciAction: state.bciAction,
    dimensions: state.graphViewDimensions
  };
}

// Binds actions to component's props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setBCIAction
    },
    dispatch
  );
}

class BCITrain extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUp1Visible: false,
      isCollecting1: false,
      isCollecting2: false,
      isFitting: false,
      score: "",
      counts: "",
      priors: "",
      means: "",
      variances: "",
      discrimPower: "",
      featureRanking: ""
    };

    Classifier.getNumSamples().then(promise => this.setState(promise));
  }

  renderClass1() {
    if (this.state.isCollecting1) {
      return (
        <View style={styles.dataClassContainer}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.classTitle}>
              {I18n.t("trainOff")}
            </Text>
            <Text style={styles.body}>
              {this.state.class1Samples} {I18n.t("trainSamples")}{" "}
            </Text>
          </View>
          <ActivityIndicator color={"#6CCBEF"} size={"large"} />
          <SandboxButton
            onPress={() => Classifier.stopCollecting()}
            active={true}
          >
            {I18n.t("trainStop")}
          </SandboxButton>
        </View>
      );
    } else {
      return (
        <View style={styles.dataClassContainer}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.classTitle}>
              {I18n.t("trainOff")}
            </Text>
            <Text style={styles.body}>
              {this.state.class1Samples} {I18n.t("trainSamples")}
            </Text>
          </View>
          <SandboxButton
            onPress={() => {
              this.setState({ isCollecting1: true });
              Classifier.collectTrainingData(1).then(promise =>
                this.setState({ class1Samples: promise, isCollecting1: false })
              );
            }}
            active={!this.state.isCollecting2}
            disabled={this.state.isCollecting2}
          >
            {I18n.t("trainCollect")}
          </SandboxButton>
        </View>
      );
    }
  }

  renderClass2() {
    if (this.state.isCollecting2) {
      return (
        <View style={styles.dataClassContainer}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.classTitle}>
              {I18n.t("trainOn")}
            </Text>
            <Text style={styles.body}>
              {this.state.class2Samples} {I18n.t("trainSamples")}
            </Text>
          </View>
          <ActivityIndicator color={"#6CCBEF"} size={"large"} />
          <SandboxButton
            onPress={() => Classifier.stopCollecting()}
            active={true}
          >
            {I18n.t("trainStop")}
          </SandboxButton>
        </View>
      );
    } else {
      return (
        <View style={styles.dataClassContainer}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.classTitle}>
              {I18n.t("trainOn")}
            </Text>
            <Text style={styles.body}>
              {this.state.class2Samples} {I18n.t("trainSamples")}
            </Text>
          </View>
          <SandboxButton
            onPress={() => {
              this.setState({ isCollecting2: true });
              Classifier.collectTrainingData(2).then(promise =>
                this.setState({ class2Samples: promise, isCollecting2: false })
              );
            }}
            active={!this.state.isCollecting1}
            disabled={this.state.isCollecting1}
          >
            {I18n.t("trainCollect")}
          </SandboxButton>
        </View>
      );
    }
  }

  renderClassifierContainer() {
    if (this.state.score == "") {
      return (
        <View style={styles.classifierContainer}>
          <Text style={styles.sectionTitle}>Classifier</Text>
          <SandboxButton
            onPress={() => {
              this.setState({ isFitting: true });
              Classifier.fitWithScore(6).then(promise => {
                this.setState(promise);
                this.setState({ isFitting: false });
              });
            }}
            active={
              !this.state.class2Samples < 1 && !this.state.class1Samples < 1
            }
            disabled={
              this.state.class2Samples < 1 || this.state.class1Samples < 1
            }
          >
            {I18n.t("trainFitClassifier")}
          </SandboxButton>
        </View>
      );
    } else if (this.state.isFitting) {
      return (
        <View style={styles.classifierContainer}>
          <Text style={styles.sectionTitle}>Classifier</Text>
          <ActivityIndicator color={"#6CCBEF"} size={"large"} />
        </View>
      );
    } else {
      return (
        <View style={styles.classifierContainer}>
          <Text style={styles.sectionTitle}>Classifier</Text>
          <View style={styles.classifierDataContainer}>
            <View style={styles.classifierTextContainer}>
              <Text style={styles.body}>
                {I18n.t("trainAccuracy")}:{" "}
                {Math.round(this.state.score * 1000) / 1000}
              </Text>
              <SandboxButton
                onPress={() => {
                  this.setState({ isFitting: true });
                  Classifier.fitWithScore(6).then(promise => {
                    this.setState(promise);
                    this.setState({ isFitting: false });
                  });
                }}
                active={
                  this.state.class2Samples >= 1 &&
                  !this.state.isCollecting2 &&
                  !this.state.isCollecting1
                }
              >
                {I18n.t("trainReFit")}
              </SandboxButton>
            </View>
            <View style={styles.classifierGraphContainer}>
              <MiniChart
                height={this.props.dimensions.height / 1.25}
                width={this.props.dimensions.width / 1.5}
                data={this.state.featureRanking}
              />
            </View>
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", height: 30, }}
          >
            <Text style={styles.sectionTitle}>Training Data</Text>
            <View style={styles.decisionContainer}>
              <DecisionButton
                onPress={() => {
                  this.props.setBCIAction(config.bciAction.VIBRATE);
                }}
                active={this.props.bciAction == config.bciAction.VIBRATE}
              >
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../assets/vibrate.png")}
                  resizeMode="contain"
                />
              </DecisionButton>
              <DecisionButton
                onPress={() => {
                  this.props.setBCIAction(config.bciAction.LIGHT);
                }}
                active={this.props.bciAction == config.bciAction.LIGHT}
              >
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../assets/light.png")}
                  resizeMode="contain"
                />
              </DecisionButton>
            </View>
          </View>
          {this.renderClass1()}
          {this.renderClass2()}
        </View>

        <View style={styles.hr} />
        <View style={styles.contentContainer}>
          {this.renderClassifierContainer()}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ flex: 1 }}>
            <LinkButton path="/bciRun" disabled={this.state.score === "" || this.state.bciAction == ""}>
              {I18n.t("trainRunIt")}
            </LinkButton>
          </View>
          <View style={{ flex: 1 }}>
            <Button
              onPress={() => {
                Classifier.reset();
                this.setState({
                  popUp1Visible: false,
                  class1Samples: 0,
                  class2Samples: 0,
                  isCollecting1: false,
                  isCollecting2: false,
                  isFitting: false,
                  score: "",
                  counts: "",
                  priors: "",
                  means: "",
                  variances: "",
                  discrimPower: "",
                  featureRanking: ""
                });
              }}
            >
              {I18n.t("trainReset")}
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BCITrain);

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    currentTitle: {
      marginLeft: 20,
      marginTop: 10,
      fontSize: 13,
      fontFamily: "Roboto-Medium",
      color: "#484848"
    },

    body: {
      fontFamily: "Roboto-Light",
      fontSize: 16,
      color: "#484848",
      textAlign: "center"
    },

    container: {
      paddingBottom: 15,
      backgroundColor: "#ffffff",
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch"
    },

    dataClassContainer: {
      padding: 10,
      margin: 5,
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      elevation: 2
    },

    hr: {
      borderBottomWidth: 1,
      borderColor: "#D3D3D3"
    },

    title: {
      textAlign: "center",
      margin: 15,
      lineHeight: 50,
      color: "#484848",
      fontFamily: "Roboto-Black",
      fontSize: 48
    },

    sectionTitle: {
      fontFamily: "Roboto-Black",
      color: "#484848",
      lineHeight: 30,
      fontSize: 22,
      position: "absolute",
      top:0,
      left:0,
    },

    classTitle: {
      fontSize: 20,
      fontFamily: "Roboto-Medium",
      color: "#484848"
    },

    graphContainer: {
      backgroundColor: "#72c2f1",
      flex: 4,
      justifyContent: "center",
      alignItems: "stretch"
    },

    contentContainer: {
      margin: 15,
      flex: 1,
      alignItems: "stretch"
    },

    actionContainer: {
      margin: 15,
      marginBottom: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },

    decisionContainer: {
      flexDirection: "row",
      width: 80,
      justifyContent: "space-between",
      position: 'absolute',
      top:0,
      right:0,
    },

    classifierContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },

    classifierDataContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "stretch",
      flexWrap: "wrap"
    },

    classifierGraphContainer: {
      flex: 2,
      justifyContent: "space-between",
      alignItems: "center"
    },

    classifierTextContainer: {
      flex: 1,
      paddingTop: 20,
      paddingBottom: 20,
      alignItems: "center",
      justifyContent: "center"
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      viewPager: {
        flex: 3
      },

      classTitle: {
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
