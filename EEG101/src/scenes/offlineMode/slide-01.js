import React, { Component } from "react";
import { Text, View, ViewPagerAndroid, Image } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MediaQueryStyleSheet } from "react-native-responsive";

import { setGraphViewDimensions } from "../../redux/actions";
import config from "../../redux/config";
import LinkButton from "../../components/LinkButton";
import PopUp from "../../components/PopUp";
import PopUpLink from "../../components/PopUpLink";
import I18n from "../../i18n/i18n";
import * as colors from "../../styles/colors";
import PlayPauseButton from "../../components/PlayPauseButton.js";
import GraphView from "../../interface/GraphView";

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function mapStateToProps(state) {
  return {
    isOfflineMode: state.isOfflineMode
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
      popUp1Visible: false,
      popUp2Visible: false,
      popUp3Visible: false,
      popUp4Visible: false
    };
  }

  offlineDataSource(slidePosition) {
    if (this.props.isOfflineMode) {
      switch (slidePosition) {
        case 0:
          return "clean";

        case 1:
          return "blinks";

        case 2:
          return "cat";

        case 3:
          return "relax";
      }
    }
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
            offlineData={this.offlineDataSource(this.state.slidePosition)}
            style={styles.graphView}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.currentTitle}>
            {I18n.t("introductionSlideTitle")}
          </Text>
        </View>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}
          onPageSelected={e =>
            this.setState({ slidePosition: e.nativeEvent.position })}
        >
          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              The brain produces electricity
            </Text>
            <Text style={styles.body}>
              This is an example of
              <PopUpLink onPress={() => this.setState({ popUp1Visible: true })}>
                {" EEG "}
              </PopUpLink>
              data, showing the electrical activity of the brain
            </Text>
            <Image
              source={require("../../assets/swipeicon.png")}
              resizeMode="contain"
              style={styles.swipeImage}
            />
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              Noise in the EEG signal
            </Text>
            <Text style={styles.body}>
              The EEG is subject to many different types of{' '}
              <PopUpLink onPress={() => this.setState({ popUp2Visible: true })}>
                noise.
              </PopUpLink>
            </Text>
            <Text style={styles.body}>
              Blinks, for example, produce large fluctuations in the signal due to muscle activity
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              EEG cannot read minds
            </Text>
            <Text style={styles.body}>
              For the most part, raw EEG data is pretty uninformative
            </Text>
            <Text style={styles.body}>
              With processing, EEG can give clues to overall brain activity, but it's not capable of{' '}
              <PopUpLink onPress={() => this.setState({ popUp3Visible: true })}>
                {I18n.t("readingMindsLink")}
              </PopUpLink>.
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
          image={require("../../assets/hansberger.jpg")}
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

    graphView: {flex: 1},

    graphContainer: {
      flex: 4,
      justifyContent: "center",
      alignItems: "stretch"
    },

    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
