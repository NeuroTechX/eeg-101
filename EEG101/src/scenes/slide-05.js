import React, { Component } from "react";
import { Animated, Text, View, ViewPagerAndroid } from "react-native";
import Animation from "lottie-react-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import config from "../redux/config.js";
import LinkButton from "../components/LinkButton";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";
import I18n from "../i18n/i18n";
import * as colors from "../styles/colors";

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function mapStateToProps(state) {
  return {
    dimensions: state.graphViewDimensions
  };
}

class SlideFive extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUpVisible: false
    };
  }

  componentDidMount() {
    this.animation.play();
  }

  loopAnimation() {
    Animated.sequence([
      Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 10000
      }),
      Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 10000
      })
    ]).start(event => {
      if (event.finished) {
        this.loopAnimation();
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.graphContainer}>
          <Animation
            ref={animation => {
              this.animation = animation;
            }}
            style={{
              height: this.props.dimensions.height,
              width: this.props.dimensions.width
            }}
            source="epoching.json"
            loop={true}
          />
        </View>

        <Text style={styles.currentTitle}>
          {I18n.t("epochingSlideTitle")}
        </Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}
        >
          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              {I18n.t("chunkingSignal")}
            </Text>
            <Text style={styles.body}>
              {I18n.t("EEGDividedSegments")}{" "}
              <PopUpLink onPress={() => this.setState({ popUpVisible: true })}>
                {I18n.t("epochsLink")}
              </PopUpLink>.
            </Text>
            <LinkButton path="./slideSix">
              {I18n.t("nextLink")}
            </LinkButton>
          </View>
        </ViewPagerAndroid>

        <PopUp
          onClose={() => this.setState({ popUpVisible: false })}
          visible={this.state.popUpVisible}
          title={I18n.t("epochsTitle")}
        >
          {I18n.t("epochsDescription")}
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
      backgroundColor: "white",
      flex: 4,
      justifyContent: "center",
      alignItems: "stretch"
    },

    header: {
      fontFamily: "Roboto-Bold",
      color: colors.black,
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

export default connect(mapStateToProps)(SlideFive);
