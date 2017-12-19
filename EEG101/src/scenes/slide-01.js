import React, { Component } from "react";
import { Text, View, ViewPagerAndroid, Image } from "react-native";
import { connect } from "react-redux";
import config from "../redux/config";
import { bindActionCreators } from "redux";
import { setGraphViewDimensions } from "../redux/actions";
import LinkButton from "../components/LinkButton";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";
import { MediaQueryStyleSheet } from "react-native-responsive";
import I18n from "../i18n/i18n";
import * as colors from "../styles/colors";
import PlayPauseButton from "../components/PlayPauseButton.js";

//Interfaces. For elements that bridge to native
import GraphView from "../native/GraphView";

function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
    notchFrequency: state.notchFrequency
  };
}

// Binds actions to component's props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setGraphViewDimensions
    },
    dispatch
  );
}

class SlideOne extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      slidePosition: 0,
      isPlaying: true,
      popUp1Visible: false,
      popUp2Visible: false,
      popUp3Visible: false,
      popUp4Visible: false
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={styles.graphContainer}
          onLayout={event => {
            // Captures the width and height of the graphContainer to determine overlay positioning properties in PSDGraph
            let { x, y, width, height } = event.nativeEvent.layout;
            this.props.setGraphViewDimensions({
              x: x,
              y: y,
              width: width,
              height: height
            });
          }}
          // Receives a native callback event e that is used to set slidePosition state
          onPageSelected={e =>
            this.setState({ slidePosition: e.nativeEvent.position })}
        >
          <GraphView
            notchFrequency={this.props.notchFrequency}
            style={styles.graphView}
            isPlaying={this.state.isPlaying}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.currentTitle}>
            {I18n.t("introductionSlideTitle")}
          </Text>
          <PlayPauseButton
            onPress={() => this.setState({ isPlaying: !this.state.isPlaying })}
            isRunning={this.state.isPlaying}
            size={40}
          />
        </View>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}
          onPageSelected={e =>
            this.setState({ slidePosition: e.nativeEvent.position })}
        >
          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              {I18n.t("brainElectricity")}
            </Text>
            <Text style={styles.body}>
              {I18n.t("usingThe")}{' '}
              <PopUpLink onPress={() => this.setState({ popUp1Visible: true })}>
                {I18n.t("EEGLink")}
              </PopUpLink>
              {' '}{I18n.t("deviceCanDetect")}
            </Text>
            <Image
              source={require("../assets/swipeicon.png")}
              resizeMode="contain"
              style={styles.swipeImage}
            />
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              {I18n.t("tryBlinkingEyes")}
            </Text>
            <Text style={styles.body}>
              {I18n.t("doesSignalChange")}
            </Text>
            <Text style={styles.body}>
              {I18n.t("eyeMovementCreates")}{' '}
              <PopUpLink onPress={() => this.setState({ popUp2Visible: true })}>
                {I18n.t("noiseLink")}
              </PopUpLink>
            {' '}{I18n.t("inEEGSignal")}
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              {I18n.t("tryThinkingAbout")}
            </Text>
            <Text style={styles.body}>
              {I18n.t("doesSignalChange")}
            </Text>
            <Text style={styles.body}>
              {I18n.t("althoughEEG")}{' '}
              <PopUpLink onPress={() => this.setState({ popUp3Visible: true })}>
                {I18n.t("readingMindsLink")}
              </PopUpLink>.
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              {I18n.t("tryClosingEyes10")}
            </Text>
            <Text style={styles.body}>
              {I18n.t("mayNoticeSignalChange")}{' '}
              <PopUpLink onPress={() => this.setState({ popUp4Visible: true })}>
                {I18n.t("alphaWavesLink")}
              </PopUpLink>
            </Text>
            <LinkButton path="./slideTwo">
              {I18n.t("nextLink")}
            </LinkButton>
          </View>
        </ViewPagerAndroid>

        <PopUp
          onClose={() => this.setState({ popUp1Visible: false })}
          visible={this.state.popUp1Visible}
          title={I18n.t("whatIsEEGTitle")}
          image={require("../assets/hansberger.jpg")}
        >
          {I18n.t("whatIsEEGDescription")}
        </PopUp>

        <PopUp
          onClose={() => this.setState({ popUp2Visible: false })}
          visible={this.state.popUp2Visible}
          title={I18n.t("noiseTitle")}
        >
          {I18n.t("noiseDescription")}
        </PopUp>

        <PopUp
          onClose={() => this.setState({ popUp3Visible: false })}
          visible={this.state.popUp3Visible}
          title={I18n.t("cannotReadMindsTitle")}
        >
          {I18n.t("cannotReadMindsDescription")}
        </PopUp>

        <PopUp
          onClose={() => this.setState({ popUp4Visible: false })}
          visible={this.state.popUp4Visible}
          title={I18n.t("eyeRythymsTitle")}
        >
          {I18n.t("eyeRythymsDescription")}
        </PopUp>

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

export default connect(mapStateToProps, mapDispatchToProps)(SlideOne);

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    pageStyle: {
      padding: 15,
      alignItems: "stretch",
      justifyContent: "space-around"
    },

    currentTitle: {
      fontSize: 13,
      fontFamily: "Roboto-Medium",
      color: colors.skyBlue
    },

    body: {
      fontFamily: "Roboto-Light",
      color: colors.black,
      fontSize: 19
    },

    container: {
      backgroundColor: colors.white,
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch"
    },

    graphContainer: {
      flex: 4,
      justifyContent: "center",
      alignItems: "stretch"
    },

    graphView: {
      flex: 1
    },

    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: 'center',
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10
    },

    sandboxButtonContainer: {
      position: "absolute",
      right: 5,
      top: 5
    },

    header: {
      fontFamily: "Roboto-Bold",
      color: colors.black,
      fontSize: 20
    },

    viewPager: {
      borderWidth: 1,
      flex: 4
    },

    swipeImage: {
      height: 40,
      alignSelf: "center"
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
      },

      swipeImage: {
        height: 75,
        width: 75
      }
    }
  }
);
