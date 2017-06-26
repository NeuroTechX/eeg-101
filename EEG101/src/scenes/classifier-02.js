import React, { Component } from "react";
import { StyleSheet, Text, View, ViewPagerAndroid, Image } from "react-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import config from "../redux/config";
import LinkButton from "../components/LinkButton";
import SandboxButton from "../components/SandboxButton.js";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";

class BCITwo extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUp1Visible: false,
      action: "",
      enableScroll: false,
      slidePosition: 0
    };
  }

  handleScroll() {
    if (this.state.slidePosition === 0 && this.state.action === "") {
      return;
    }
    return (
      <Image
        source={require("../assets/swipeiconwhite.png")}
        resizeMode="contain"
        style={styles.swipeImage}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>

        <Text style={styles.currentTitle}>TRAINING A BCI</Text>

        <ViewPagerAndroid
          style={styles.viewPager}
          initialPage={0}
          scrollEnabled={this.state.enableScroll}
          // Receives a native callback event e that is used to set slidePosition state
          onPageSelected={e =>
            this.setState({ slidePosition: e.nativeEvent.position })}
        >

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              Let's train a machine learning algorithm with your EEG
            </Text>
            <Text style={styles.body}>
              First, what do you want this BCI to do?
            </Text>
            <View style={styles.decisionContainer}>
              <SandboxButton
                onPress={this.setState({ action: this.config.VIBRATE })}
                active={this.state.action == this.config.bciAction.VIBRATE}
              >
                Vibrate
              </SandboxButton>
              <SandboxButton
                onPress={this.setState({ action: this.config.bciAction.LIGHT })}
                active={this.state.action == this.config.bciAction.LIGHT}
              >
                Light
              </SandboxButton>
            </View>
            <View style={{ marginBottom: 20 }}>
              {this.handleScroll()}
            </View>
          </View>

          <View style={styles.pageStyle}>

          </View>

        </ViewPagerAndroid>

        <PopUp
          onClose={() => this.setState({ popUpVisible: false })}
          visible={this.state.popUpVisible}
          image={require("../assets/hansberger.jpg")}
          title="Pop up title"
        >
          Some more advanced lesson text that goes more into depth.
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

    decisionContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center"
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
export default connect(SceneTemplate);
