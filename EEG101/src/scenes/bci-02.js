import React, { Component } from "react";
import { Text, View, ViewPagerAndroid, Image } from "react-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import config from "../redux/config";
import { bindActionCreators } from "redux";
import { setBCIAction } from "../redux/actions";
import Classifier from "../native/Classifier.js";
import I18n from "../i18n/i18n";
import DataCollector from "../components/DataCollector.js";
import ClassifierInfoDisplayer from "../components/ClassifierInfoDisplayer.js";
import DecisionButton from "../components/DecisionButton.js";
import PopUp from "../components/PopUp";
import * as colors from "../styles/colors";

function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
    dimensions: state.graphViewDimensions,
    bciAction: state.bciAction,
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

class BCITwo extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUpVisible: false,
      enableScroll: this.props.bciAction.length >= 3,
      slidePosition: 0,
      maxSlidePosition: 0
    };
  }

  componentDidMount() {
    Classifier.startClassifier(this.props.notchFrequency);
    Classifier.startNoiseListener();
  }

  componentWillUnmount() {
    Classifier.stopNoiseListener();
  }

  renderSwipeImage() {
    if (this.state.enableScroll === true) {
      return (
        <Image
          source={require("../assets/swipeiconwhite.png")}
          resizeMode="contain"
          style={styles.swipeImage}
        />
      );
    } else return;
  }

  render() {
    return (
      <View style={styles.container}>
        <ViewPagerAndroid
          style={styles.viewPager}
          initialPage={0}
          scrollEnabled={this.state.enableScroll}
          // Receives a native callback event e that is used to set slidePosition state
          onPageSelected={event => {
            this.setState({ slidePosition: event.nativeEvent.position });
            if (
              event.nativeEvent.position > this.state.maxSlidePosition &&
              this.state.maxSlidePosition < 2
            ) {
              this.setState({
                maxSlidePosition: event.nativeEvent.position,
                enableScroll: false
              });
            }
          }}
        >
          <View style={styles.pageStyle}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{I18n.t("step1Title")}</Text>
              <Text style={styles.subTitle}>{I18n.t("chooseCommand")}</Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.textWrapper}>
                <Text style={styles.body}>{I18n.t("bciCommands")}</Text>
              </View>
              <View style={styles.decisionContainer}>
                <DecisionButton
                  size={100}
                  onPress={() => {
                    this.setState({
                      enableScroll: true
                    });
                    this.props.setBCIAction(config.bciAction.VIBRATE);
                  }}
                  active={this.props.bciAction == config.bciAction.VIBRATE}
                >
                  <Image
                    style={styles.decisionImage}
                    source={require("../assets/vibrate.png")}
                    resizeMode="contain"
                  />
                  <Text style={styles.iconText}>Vibrate</Text>
                </DecisionButton>
                <DecisionButton
                  size={100}
                  onPress={() => {
                    this.setState({
                      enableScroll: true
                    });
                    this.props.setBCIAction(config.bciAction.LIGHT);
                  }}
                  active={this.props.bciAction == config.bciAction.LIGHT}
                >
                  <Image
                    style={styles.decisionImage}
                    source={require("../assets/light.png")}
                    resizeMode="contain"
                  />
                  <Text style={styles.iconText}>Light</Text>
                </DecisionButton>
              </View>
            </View>
            <View style={styles.swipeView}>{this.renderSwipeImage()}</View>
          </View>

          <View style={styles.pageStyle}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{I18n.t("step2Title")}</Text>
              <Text style={styles.subTitle}>{I18n.t("offData")}</Text>
            </View>
            <View style={styles.contentContainer}>
              <DataCollector
                bciAction={this.props.bciAction}
                noise={this.props.noise}
                class={1}
                onComplete={() => this.setState({ enableScroll: true })}
              />
            </View>
            <View style={styles.swipeView}>{this.renderSwipeImage()}</View>
          </View>

          <View style={styles.pageStyle}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{I18n.t("step3Title")}</Text>
              <Text style={styles.subTitle}>{I18n.t("onData")}</Text>
            </View>
            <View style={styles.contentContainer}>
              <DataCollector
                bciAction={this.props.bciAction}
                noise={this.props.noise}
                class={2}
                onComplete={() => this.setState({ enableScroll: true })}
              />
            </View>
            <View style={styles.swipeView}>{this.renderSwipeImage()}</View>
          </View>

          <View style={styles.pageStyle}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{I18n.t("step4Title")}</Text>
              <Text style={styles.subTitle}>{I18n.t("trainClassifier")}</Text>
            </View>
            <View style={styles.contentContainer}>
              <ClassifierInfoDisplayer
                folds={6}
                onComplete={() => this.setState({ enableScroll: true })}
              />
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

export default connect(mapStateToProps, mapDispatchToProps)(BCITwo);

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    body: {
      fontFamily: "Roboto-Light",
      fontSize: 18,
      color: colors.white,
      textAlign: "center"
    },

    container: {
      backgroundColor: colors.skyBlue,
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch"
    },

    title: {
      textAlign: "center",
      margin: 15,
      lineHeight: 50,
      color: colors.white,
      fontFamily: "Roboto-Black",
      fontSize: 48
    },

    subTitle: {
      fontSize: 16,
      fontFamily: "Roboto-Medium",
      color: colors.white
    },

    iconText: {
      fontFamily: "Roboto-Medium",
      color: colors.black,
      fontSize: 20
    },

    decisionImage: {
      height: 50
    },

    swipeView: {
      flex: 1
    },

    graphContainer: {
      backgroundColor: colors.skyBlue,
      flex: 4,
      justifyContent: "center",
      alignItems: "stretch"
    },

    contentContainer: {
      flex: 8,
      justifyContent: "center",
      alignItems: "stretch"
    },

    decisionContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around"
    },

    header: {
      fontFamily: "Roboto-Bold",
      fontSize: 18,
      margin: 20,
      color: colors.white,
      alignSelf: "flex-start"
    },

    textWrapper: {
      flex: 2,
      justifyContent: "center",
      alignItems: "center"
    },

    dataClassContainer: {
      borderWidth: 1,
      flex: 1
    },

    viewPager: {
      flex: 4
    },

    pageStyle: {
      flex: 1,
      padding: 20,
      alignItems: "center",
      justifyContent: "space-around"
    },

    swipeImage: {
      width: 50,
      height: 50
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

      body: {
        fontSize: 25
      }
    }
  }
);
