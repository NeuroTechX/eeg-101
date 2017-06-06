import React, { Component } from "react";
import { StyleSheet, Text, View, ViewPagerAndroid, Image } from "react-native";
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
      popUp1Visible: false
    };
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.graphContainer}>
          <Text>
            Place visual component here. Probably GraphView, Image, or Lottie
            animation
            {" "}
          </Text>
        </View>

        <Text style={styles.currentTitle}>CLASSIFIER</Text>

        <ViewPagerAndroid style={styles.viewPager} initialPage={0}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Test</Text>

            <Button onPress={()=>Classifier.collectTrainingData("A")} active={true}>Collect</Button>
            <Button onPress={()=>Classifier.stopCollecting()} active={true}>Stop</Button>
            <Button onPress={()=>Classifier.train()} active={true}>Train</Button>
            <Button onPress={()=>Classifier.runClassification()} active={true}>Run</Button>
            <Button onPress={()=>Classifier.reset()} active={true}>Reset</Button>

            <LinkButton path="/connectorThree"> NEXT </LinkButton>
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
export default connect(mapStateToProps)(ClassifierTest);
