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
      featureRanking: "",
    };

    Classifier.getNumSamples().then(promise => this.setState(promise))
  }



  renderClass1() {
    if (this.state.isCollecting1) {
      return (
        <View style={styles.dataClassContainer}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.classTitle}>OFF</Text>
            <Text style={styles.body}>{this.state.class1Samples} samples</Text>
          </View>
          <ActivityIndicator color={"#6CCBEF"} size={"small"} />
          <Button onPress={() => Classifier.stopCollecting()} active={true}>
            Stop
          </Button>
        </View>
      );
    } else {
      return (
        <View style={styles.dataClassContainer}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.classTitle}>OFF</Text>
            <Text style={styles.body}>{this.state.class1Samples} samples</Text>
          </View>
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
          <View style={styles.cardTextContainer}>
            <Text style={styles.classTitle}>ON</Text>
            <Text style={styles.body}>{this.state.class1Samples} samples</Text>
          </View>
          <ActivityIndicator color={"#6CCBEF"} size={"small"} />
          <Button onPress={() => Classifier.stopCollecting()} active={true}>
            Stop
          </Button>
        </View>
      );
    } else {
      return (
        <View style={styles.dataClassContainer}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.classTitle}>ON</Text>
            <Text style={styles.body}>{this.state.class2Samples} samples</Text>
          </View>
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
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Training Data</Text>
          {this.renderClass1()}
          {this.renderClass2()}

        </View>

        <View style={styles.hr}/>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Classifier</Text>
          {this.renderClassifierContainer()}
        </View>

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
          <LinkButton path="/classifier-run" disabled={this.state.score==""}>RUN IT</LinkButton>
        </View>
        </View>
    );
  }
}

export default connect(mapStateToProps)(ClassifierTest);

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
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch"
    },

    dataClassContainer: {
      padding: 10,
      margin: 5,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation:2,
    },

    cardTextContainer: {
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },

    hr: {
      borderBottomWidth: 1,
      borderColor: "#D3D3D3",
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
      fontFamily: 'Roboto-Black',
      color: '#484848',
      lineHeight: 30,
      fontSize: 22,
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
