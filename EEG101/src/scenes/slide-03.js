import React, { Component } from "react";
import { StyleSheet, Text, View, ViewPagerAndroid, Image } from "react-native";
import { connect } from "react-redux";
import config from "../redux/config";
import { MediaQueryStyleSheet } from "react-native-responsive";
import LinkButton from "../components/LinkButton";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";
import ElectrodeSelector from "../components/ElectrodeSelector";
import I18n from "../i18n/i18n";
import * as colors from "../styles/colors";

//Interfaces. For elements that bridge to native
import GraphView from "../native/GraphView";

function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
    notchFrequency: state.notchFrequency
  };
}

class SlideThree extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      channelOfInterest: 1,
      popUp1Visible: false,
      popUp2Visible: false,
      popUp3Visible: false
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.graphContainer}>
          <GraphView
            notchFrequency={this.props.notchFrequency}
            style={styles.graphView}
            channelOfInterest={this.state.channelOfInterest}
          />
        </View>

        <Text style={styles.currentTitle}>
          {I18n.t("hardwareSlideTitle")}
        </Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}
        >
          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              {I18n.t("howDoesEEGDeviceWork")}
            </Text>
            <Text style={styles.body}>
              {I18n.t("electricalActivitySensed")}{' '}
              <PopUpLink onPress={() => this.setState({ popUp1Visible: true })}>
                {I18n.t("electrodesLink")}
              </PopUpLink>
              {' '}
              {I18n.t("placedOnScalp")}
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              {I18n.t("deviceHas4Electrodes")}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.body, { flex: 0.5, marginRight: 10 }]}>
                {I18n.t("touchTheHeadDiagram")}{' '}
                <PopUpLink
                  onPress={() => this.setState({ popUp2Visible: true })}
                >
                  {I18n.t("namesLink")}
                </PopUpLink>
                {' '}{I18n.t("forEachElectrode")}
              </Text>
              <ElectrodeSelector
                channelOfInterest={channel =>
                  this.setState({ channelOfInterest: channel })}
              />
            </View>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              {I18n.t("whatElectrodesMeasure")}
            </Text>
            <Text style={styles.body}>
              {I18n.t("voltageFluctuations")}{' '}
              <PopUpLink onPress={() => this.setState({ popUp3Visible: true })}>
                {I18n.t("referenceElectrodeLink")}
              </PopUpLink>
              {' '}{I18n.t("amplified1Mil")}
            </Text>
            <LinkButton path="./slideFour"> NEXT </LinkButton>
          </View>
        </ViewPagerAndroid>

        <PopUp
          onClose={() => this.setState({ popUp1Visible: false })}
          visible={this.state.popUp1Visible}
          title={I18n.t("electrodesTitle")}
        >
          {I18n.t("electrodesDescription")}
        </PopUp>

        <PopUp
          onClose={() => this.setState({ popUp2Visible: false })}
          visible={this.state.popUp2Visible}
          title={I18n.t("electrodeNamingTitle")}
          image={require("../assets/electrodelocations.png")}
        >
          {I18n.t("electrodeNamingDescription")}
        </PopUp>

        <PopUp
          onClose={() => this.setState({ popUp3Visible: false })}
          visible={this.state.popUp3Visible}
          title={I18n.t("referencingTitle")}
          image={require("../assets/reference.png")}
        >
          {I18n.t("referencingDescription")}
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
      fontSize: 17
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

    graphContainer: {
      flex: 4,
      justifyContent: "center",
      alignItems: "stretch"
    },

    graphView: {
      flex: 1
    },

    header: {
      fontFamily: "Roboto-Bold",
      color: colors.black,
      fontSize: 20
    },

    viewPager: {
      flex: 4
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

export default connect(mapStateToProps)(SlideThree);
