import React, { Component } from "react";
import { StyleSheet, Text, View, ViewPagerAndroid, Image } from "react-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import config from "../redux/config";
import { bindActionCreators } from "redux";
import { setBCIAction } from "../redux/actions";
import Classifier from "../interface/Classifier.js";
import I18n from "../i18n/i18n";
import DataCollector from "../components/DataCollector.js";
import ClassifierInfoDisplayer from "../components/ClassifierInfoDisplayer.js";
import LinkButton from "../components/LinkButton";
import DecisionButton from "../components/DecisionButton.js";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";

function mapStateToProps(state) {
  return {
    dimensions: state.graphViewDimensions,
    bciAction: state.bciAction
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
      enableScroll: false,
      slidePosition: 0,
      maxSlidePosition: 0
    };
  }

  handleScroll() {
    if (this.state.enableScroll === true) {
      return (
        <Image
          source={require("../assets/swipeicon.png")}
          resizeMode="contain"
          style={styles.swipeImage}
        />
      );
    } else return;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.currentTitle}>BUILDING A BCI</Text>
        <ViewPagerAndroid
          style={styles.viewPager}
          initialPage={0}
          scrollEnabled={this.state.enableScroll}
          // Receives a native callback event e that is used to set slidePosition state
          onPageSelected={e => {
            this.setState({ slidePosition: e.nativeEvent.position });
            if (e.nativeEvent.position > this.state.maxSlidePosition && this.state.maxSlidePosition < 2) {
              this.setState({
                maxSlidePosition: e.nativeEvent.position,
                enableScroll: false
              });
            }
          }}
        >
          <View style={styles.pageStyle}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{I18n.t("step1Title")}</Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.textWrapper}>
                <Text style={styles.body}>
                  This BCI will allow you to execute a command on your phone by
                  switching between two 'brain states'
                  {"\n"}{"\n"}
                  First, what do you want this BCI to do?
                </Text>
              </View>
              <View style={styles.decisionContainer}>
                <DecisionButton
                  onPress={() => {
                    this.setState({
                      enableScroll: true
                    });
                    this.props.setBCIAction(config.bciAction.VIBRATE);
                  }}
                  active={this.props.bciAction == config.bciAction.VIBRATE}
                >
                  Vibrate
                </DecisionButton>
                <DecisionButton
                  onPress={() => {
                    this.setState({
                      enableScroll: true
                    });
                    this.props.setBCIAction(config.bciAction.LIGHT);
                  }}
                  active={this.props.bciAction == config.bciAction.LIGHT}
                >
                  Light
                </DecisionButton>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              {this.handleScroll()}
            </View>
          </View>

          <View style={styles.pageStyle}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{I18n.t("step2Title")}</Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.textWrapper}>
                <Text style={styles.body}>
                  Let's teach the algorithm which brain state you’ll use to keep
                  the {this.props.bciAction} OFF.
                  {"\n"}{"\n"}
                  You can try whatever you
                  want, but we
                  recommend opening your eyes and concentrating. When you are
                  ready, click to record 20 seconds of data.
                </Text>
              </View>
              <DataCollector
                class={2}
                onComplete={() => this.setState({ enableScroll: true })}
              />
            </View>
            <View style={{ flex: 1 }}>
              {this.handleScroll()}
            </View>
          </View>

          <View style={styles.pageStyle}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{I18n.t("step2Title")}</Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.textWrapper}>
                <Text style={styles.body}>
                  Now, let’s teach the algorithm the brain state you’ll use to
                  turn
                  the {this.props.bciAction} ON.
                  {"\n"}{"\n"}
                  Once again, you can try whatever you want. We recommend
                  closing your eyes and relaxing. Click the button below to
                  start recording another 20 seconds of data.
                </Text>
              </View>
              <DataCollector
                class={1}
                onComplete={() => this.setState({ enableScroll: true })}
              />
            </View>
            <View style={{ flex: 1 }}>
              {this.handleScroll()}
            </View>
          </View>

          <View style={styles.pageStyle}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{I18n.t("step4Title")}</Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.textWrapper}>
                <Text style={styles.body}>
                  The data you've collected is simply the powers of the
                  different brain waves (δ, θ, α, β) in your EEG across many epochs
                  {"\n"}{"\n"}
                  Next, train the{" "}
                  <PopUpLink
                    onPress={() => this.setState({ popUpVisible: true })}
                  >
                    classifier
                  </PopUpLink>{" "}
                  to distinguish between your brain states
                </Text>
              </View>
              <ClassifierInfoDisplayer
                folds={6}
                onComplete={() => this.setState({ enableScroll: true })}
              />
            </View>
            <View style={{ flex: 1 }}>
              {this.handleScroll()}
            </View>
          </View>

          <View style={styles.pageStyle}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>Run it!</Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.textWrapper}>
                <Text style={styles.body}>
                  Your classifier's score represents how well it is able to distinguish between the two brain states based on the data you collected. Closer to 1 is better
                  {"\n"}{"\n"}
                  If you are happy with your classifier's score and want to run it in real-time, click below. Otherwise, you can swipe back and collect more data
                </Text>
                </View>
                <LinkButton path="/bciRun"> RUN IT </LinkButton>
            </View>
          </View>

        </ViewPagerAndroid>

        <PopUp
          onClose={() => this.setState({ popUpVisible: false })}
          image={require("../assets/gnb.png")}
          fullSizeImage={true}
          visible={this.state.popUpVisible}
          title="Classifier"
        >
          A classifier is a type of machine learning algorithm that learns to
          distinguish between two or more groups by looking at relevant features
          of these groups. The classifier that we are training here uses the
          Gaussian Naive Bayes technique to estimate the probability that a data
          point belongs to two distinct normal distributions.

          Image from Raizada and Lee, 2013
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
      color: "#484848"
    },

    body: {
      fontFamily: "Roboto-Light",
      fontSize: 18,
      color: "#484848",
      textAlign: "center"
    },

    container: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch"
    },

    title: {
      textAlign: "center",
      margin: 15,
      lineHeight: 50,
      color: "#484848",
      fontFamily: "Roboto-Black",
      fontSize: 48
    },

    graphContainer: {
      backgroundColor: "#72c2f1",
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
      color: "#ffffff",
      alignSelf: "flex-start"
    },

    textWrapper: {
      flex: 2,
      justifyContent: "center"
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
      width: 40,
      height: 40
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
export default connect(mapStateToProps, mapDispatchToProps)(BCITwo);
