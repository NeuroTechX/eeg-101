import React, { Component } from "react";
import { Text, View, Image, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setBCIAction } from "../redux/actions";
import config from "../redux/config.js";
import { MediaQueryStyleSheet } from "react-native-responsive";
import Classifier from "../native/Classifier.js";
import PopUp from "../components/PopUp";
import DataCollectionIndicator from "../components/DataCollectionIndicator.js";
import DecisionButton from "../components/DecisionButton.js";
import SandboxButton from "../components/SandboxButton.js";
import Button from "../components/Button.js";
import LinkButton from "../components/LinkButton";
import FeatureChart from "../components/FeatureChart.js";
import I18n from "../i18n/i18n";
import * as colors from "../styles/colors";

function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
    bciAction: state.bciAction,
    dimensions: state.graphViewDimensions,
    notchFrequency: state.notchFrequency,
    noise: state.noise
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
      featurePower: "",
      class1Samples: 0,
      class2Samples: 0,
      discrimPower: ""
    };

    Classifier.getNumSamples().then(promise => this.setState(promise));
  }

  componentDidMount() {
    Classifier.startClassifier(this.props.notchFrequency);
    Classifier.startNoiseListener();
  }

  componentWillUnmount() {
    Classifier.stopNoiseListener();
  }

  renderClass1() {
    if (this.state.isCollecting1) {
      return (
        <View style={styles.dataClassContainer}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.classTitle}>{I18n.t("trainOff")}</Text>
            <Text style={styles.body}>
              {this.state.class1Samples} {I18n.t("trainSamples")}{" "}
            </Text>
          </View>
          <DataCollectionIndicator noise={this.props.noise} />
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
            <Text style={styles.classTitle}>{I18n.t("trainOff")}</Text>
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
            <Text style={styles.classTitle}>{I18n.t("trainOn")}</Text>
            <Text style={styles.body}>
              {this.state.class2Samples} {I18n.t("trainSamples")}
            </Text>
          </View>
          <DataCollectionIndicator noise={this.props.noise} />
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
            <Text style={styles.classTitle}>{I18n.t("trainOn")}</Text>
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
              if (
                this.state.class1Samples > 3 &&
                this.state.class2Samples > 3
              ) {
                this.setState({ isFitting: true });
                Classifier.fitWithScore(6).then(promise => {
                  this.setState(promise);
                  this.setState({ isFitting: false });
                });
              }
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
          <ActivityIndicator color={colors.skyBlue} size={"large"} />
        </View>
      );
    } else {
      return (
        <View style={styles.classifierContainer}>
          <Text style={styles.sectionTitle}>Classifier</Text>
          <View style={styles.classifierDataContainer}>
            <View style={styles.classifierTextContainer}>
              <Text style={styles.body}>
                {I18n.t("trainAccuracy")}:{"\n"}
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
              <SandboxButton
                active="true"
                onPress={() => Classifier.exportClassifier()}
              >
                EXPORT
              </SandboxButton>
            </View>
            <View
              style={styles.classifierGraphContainer}
              onPress={() => this.setState({ popUp1Visible: true })}
            >
              <FeatureChart
                height={this.props.dimensions.height / 1.25}
                width={this.props.dimensions.width / 1.5}
                data={this.state.featurePower}
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
          <View style={styles.trainingDataContainer}>
            <Text style={styles.sectionTitle}>Training Data</Text>
            <View style={styles.decisionContainer}>
              <DecisionButton
                onPress={() => {
                  this.props.setBCIAction(config.bciAction.VIBRATE);
                }}
                active={this.props.bciAction == config.bciAction.VIBRATE}
              >
                <Image
                  style={styles.image}
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
                  style={styles.image}
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
        <View style={styles.linkButtonsContainer}>
          <View style={styles.buttonContainer}>
            <LinkButton
              path="/bciRun"
              disabled={this.state.score === "" || this.state.bciAction == ""}
            >
              {I18n.t("trainRunIt")}
            </LinkButton>
          </View>
          <View style={styles.buttonContainer}>
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
                  discrimPower: ""
                });
              }}
            >
              {I18n.t("trainReset")}
            </Button>
          </View>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(BCITrain);

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    currentTitle: {
      marginLeft: 20,
      marginTop: 10,
      fontSize: 13,
      fontFamily: "Roboto-Medium",
      color: colors.black
    },

    body: {
      fontFamily: "Roboto-Light",
      fontSize: 16,
      color: colors.black,
      textAlign: "center"
    },

    container: {
      paddingBottom: 15,
      backgroundColor: colors.white,
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
      borderColor: colors.faintGrey
    },

    title: {
      textAlign: "center",
      margin: 15,
      lineHeight: 50,
      color: colors.black,
      fontFamily: "Roboto-Black",
      fontSize: 48
    },

    sectionTitle: {
      fontFamily: "Roboto-Black",
      color: colors.black,
      lineHeight: 30,
      fontSize: 22,
      position: "absolute",
      top: 0,
      left: 0
    },

    trainingDataContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      height: 30
    },

    classTitle: {
      fontSize: 20,
      fontFamily: "Roboto-Medium",
      color: colors.black
    },

    graphContainer: {
      backgroundColor: colors.skyBlue,
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
      position: "absolute",
      top: 0,
      right: 0
    },

    classifierContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },

    buttonContainer: { flex: 1 },

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
    },

    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "stretch",
      padding: 20,
      backgroundColor: colors.modalBlue
    },

    modalText: {
      fontFamily: "Roboto-Light",
      color: colors.black,
      fontSize: 15,
      margin: 5
    },

    modalTitle: {
      fontFamily: "Roboto-Bold",
      color: colors.black,
      fontSize: 20,
      margin: 5
    },

    modalInnerContainer: {
      alignItems: "stretch",
      backgroundColor: colors.white,
      padding: 20,
      elevation: 5,
      borderRadius: 4
    },

    linkButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-around"
    },

    image: { width: 30, height: 30 }
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
