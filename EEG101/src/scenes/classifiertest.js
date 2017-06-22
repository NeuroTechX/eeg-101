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
import { MediaQueryStyleSheet } from "react-native-responsive";
import Classifier from "../interface/Classifier.js";
import Button from "../components/SandboxButton.js";
import LinkButton from "../components/LinkButton";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";

function mapStateToProps(state) {
  return {
    dimensions: state.graphViewDimensions
  };
}

class ClassifierTest extends Component {
  constructor(props) {
    super(props);
    this.predictSubscription = null;
    this.noiseSubscription = null;

    // Initialize States
    this.state = {
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
      featureRanking: "",
    };
  }

  renderClass1() {
    if (this.state.isCollecting1) {
      return (
        <View style={styles.dataClassContainer}>
          <Text style={styles.header}>Class 1:</Text>
          <ActivityIndicator color={"#6CCBEF"} size={"small"} />
          <Button onPress={() => Classifier.stopCollecting()} active={true}>
            Stop
          </Button>
        </View>
      );
    } else {
      return (
        <View style={styles.dataClassContainer}>
          <Text style={styles.header}>Class 1:</Text>
          <Text style={styles.body}>{this.state.class1Samples} samples</Text>
          <Button
            onPress={() => {
              this.setState({ isCollecting1: true });
              Classifier.collectTrainingData(1).then(promise =>
                this.setState({ class1Samples: promise, isCollecting1: false })
              );
            }}
            active={true}
          >
            Collect
          </Button>
        </View>
      );
    }
  }

  renderClass2() {
    if (this.state.isCollecting2) {
      return (
        <View style={styles.dataClassContainer}>
          <Text style={styles.header}>Class 2:</Text>
          <ActivityIndicator color={"#6CCBEF"} size={"small"} />
          <Button onPress={() => Classifier.stopCollecting()} active={true}>
            Stop
          </Button>
        </View>
      );
    } else {
      return (
        <View style={styles.dataClassContainer}>
          <Text style={styles.header}>Class 2:</Text>
          <Text style={styles.body}>{this.state.class2Samples} samples</Text>
          <Button
            onPress={() => {
              this.setState({ isCollecting2: true });
              Classifier.collectTrainingData(2).then(promise =>
                this.setState({ class2Samples: promise, isCollecting2: false })
              );
            }}
            active={this.state.class1Samples >= 1}
          >
            Collect
          </Button>
        </View>
      );
    }
  }

  renderClassifierContainer() {
    if (this.state.score == "") {
      return (
        <View style={styles.classifierContainer}>
          <Button
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
            Fit Classifier
          </Button>
        </View>
      );
    } else if (this.state.isFitting) {
      return (
        <View style={styles.classifierContainer}>
          <ActivityIndicator color={"#6CCBEF"} size={"small"} />
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
            Re-Fit
          </Button>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.currentTitle}>CLASSIFIER</Text>
        <View style={styles.pageStyle}>
          {this.renderClass1()}
          {this.renderClass2()}
          {this.renderClassifierContainer()}


          <View style={styles.buttonContainer}>

          <Button onPress={() => {
            Classifier.reset()
            this.setState({popUp1Visible: false,
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
            featureRanking: "",})
          }} active={true}>
            Reset
          </Button>
        </View>

          <LinkButton path="/classifier-run" disabled={this.state.score==""}> TRY IT OUT </LinkButton>
        </View>
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

    body: {
      fontFamily: "Roboto-Light",
      color: "#484848",
      fontSize: 15
    },

    container: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch"
    },

    dataClassContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between"
    },

    classifierContainer: {
      flex: 3,
      justifyContent: "center",
      alignItems: "center"
    },

    buttonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
      flex: 4,
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
export default connect(mapStateToProps)(ClassifierTest);
