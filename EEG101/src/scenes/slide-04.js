import React, { Component } from "react";
import { Text, View, ViewPagerAndroid } from "react-native";
import { connect } from "react-redux";
import LinkButton from "../components/LinkButton";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";
import { MediaQueryStyleSheet } from "react-native-responsive";

//Interfaces. For elements that bridge to native
import GraphView from "../native/GraphView";
import FilterGraphView from "../native/FilterGraphView";
import config from "../redux/config";
import I18n from "../i18n/i18n";
import * as colors from "../styles/colors";

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
    dimensions: state.graphviewDimensions,
    notchFrequency: state.notchFrequency
  };
}

class SlideFour extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUpVisible: false
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.halfGraphContainer}>
          <GraphView notchFrequency={this.props.notchFrequency} style={styles.graphView} />
          <Text style={styles.halfGraphLabelText}>
            {I18n.t("raw")}
          </Text>
        </View>
        <View style={styles.halfGraphContainer}>
          <FilterGraphView
            notchFrequency={this.props.notchFrequency}
            style={styles.graphView}
            filterType={config.filterType.BANDPASS}
          />
          <Text style={styles.halfGraphLabelText}>
            {I18n.t("bandPassFilter")}
          </Text>
        </View>

        <Text style={styles.currentTitle}>
          {I18n.t("filteringSlideTitle")}
        </Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}
        >
          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              {I18n.t("meaningfulData")}
            </Text>
            <Text style={styles.body}>
              {I18n.t("firstEEGMust")}{' '}
              <PopUpLink onPress={() => this.setState({ popUpVisible: true })}>
                {I18n.t("filteredLink")}
              </PopUpLink>{' '}
              {I18n.t("toReduceSignals")}
            </Text>
            <LinkButton path="./slideFive">
              {I18n.t("nextLink")}
            </LinkButton>
          </View>
        </ViewPagerAndroid>

        <PopUp
          onClose={() => this.setState({ popUpVisible: false })}
          visible={this.state.popUpVisible}
          title={I18n.t("filtersTitle")}
        >
          {I18n.t("filtersDescription")}
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
    pageStyle: {
      padding: 20,
      alignItems: "stretch",
      justifyContent: "space-around"
    },

    body: {
      fontFamily: "Roboto-Light",
      color: colors.black,
      fontSize: 19
    },

    currentTitle: {
      marginLeft: 20,
      marginTop: 10,
      fontSize: 13,
      fontFamily: "Roboto-Medium",
      color: colors.skyBlue
    },

    container: {
      backgroundColor: colors.white,
      flex: 1,
      justifyContent: "space-around",
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

    graphView: {
      flex: 1
    },

    halfGraphContainer: {
      flex: 2,
      justifyContent: "center",
      alignItems: "stretch"
    },

    halfGraphLabelText: {
      position: "absolute",
      top: 5,
      left: 5,
      fontSize: 13,
      fontFamily: "Roboto-Medium",
      color: colors.white
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

export default connect(mapStateToProps)(SlideFour);
