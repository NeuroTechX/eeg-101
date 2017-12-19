import React, { Component } from "react";
import { Text, View, ViewPagerAndroid } from "react-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import LinkButton from "../components/LinkButton";
import config from "../redux/config";
import PopUp from "../components/PopUp";
import PopUpList from "../components/PopUpList";
import ListItemBlock from "../components/ListItemBlock";
import PopUpLink from "../components/PopUpLink";
import I18n from "../i18n/i18n";
import * as colors from "../styles/colors";

//Interfaces. For elements that bridge to native
import WaveGraphView from "../native/WaveGraphView";

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function mapStateToProps(state) {
  return {
    dimensions: state.graphViewDimensions,
    connectionStatus: state.connectionStatus,
  };
}

class SlideNine extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      channelOfInterest: 1,
      popUp1Visible: false,
      popUp2Visible: false
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <WaveGraphView
          dimensions={this.props.dimensions}
        />

        <Text style={styles.currentTitle}>
          {I18n.t("brainWavesSlideTitle")}
        </Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}
        >
          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              {I18n.t("whatDoFrequenciesRepresent")}
            </Text>
            <Text style={styles.body}>
              {I18n.t("PSDDividedBands")}
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              {I18n.t("brainWaves")}
            </Text>
            <Text style={styles.body}>
              {I18n.t("freqCorrelatedBrain")}{' '}
              <PopUpLink onPress={() => this.setState({ popUp1Visible: true })}>
                {I18n.t("brainWavesLink")}
              </PopUpLink>.
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              {I18n.t("harnessingBrainWaves")}
            </Text>
            <Text style={styles.body}>
              {I18n.t("noticePowerChanges")}{' '}
              {I18n.t("BCILink")}.
            </Text>
            <LinkButton path="/bciOne">
              {I18n.t("nextLink")}
            </LinkButton>
          </View>
        </ViewPagerAndroid>

        <PopUpList
          onClose={() => this.setState({ popUp1Visible: false })}
          visible={this.state.popUp1Visible}
        >
          <ListItemBlock title={I18n.t("deltaTitle")}>
            {I18n.t("deltaDescription")}
          </ListItemBlock>
          <ListItemBlock title={I18n.t("thetaTitle")}>
            {I18n.t("thetaDescription")}
          </ListItemBlock>
          <ListItemBlock title={I18n.t("alphaTitle")}>
            {I18n.t("alphaDescription")}
          </ListItemBlock>
          <ListItemBlock title={I18n.t("betaTitle")}>
            {I18n.t("betaDescription")}
          </ListItemBlock>
          <ListItemBlock title={I18n.t("gammaTitle")}>
            {I18n.t("gammaDescription")}
          </ListItemBlock>
        </PopUpList>

        <PopUp
          onClose={() => this.setState({ popUp2Visible: false })}
          visible={this.state.popUp2Visible}
          title={I18n.t("BCITitle")}
        >
          {I18n.t("BCIDescription")}
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
      fontSize: 17
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

export default connect(mapStateToProps)(SlideNine);
