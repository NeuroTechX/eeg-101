import React, { Component } from "react";
import { StyleSheet, Text, View, ViewPagerAndroid, Image } from "react-native";
import { connect } from "react-redux";
import config from "../redux/config";
import { bindActionCreators } from "redux";
import { setGraphViewDimensions } from "../redux/actions";
import LinkButton from "../components/LinkButton";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";
import { MediaQueryStyleSheet } from "react-native-responsive";
import I18n from '../i18n/i18n';

//Interfaces. For elements that bridge to native
import GraphView from "../interface/GraphView";

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus
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
            console.log(x, y, width, height);
            this.props.setGraphViewDimensions({
              x: x,
              y: y,
              width: width,
              height: height
            });
          }}
        >
          <GraphView style={{ flex: 1 }}/>
        </View>

        <Text style={styles.currentTitle}>{I18n.t('introductionSlideTitle')}</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}
        >

          <View style={styles.pageStyle}>
            <Text style={styles.header}>{I18n.t('brainElectricity')}</Text>
            <Text style={styles.body}>
			  {I18n.t('usingThe')}<PopUpLink onPress={() => this.setState({ popUp1Visible: true })}>{I18n.t('EEGLink')}</PopUpLink>{I18n.t('deviceCanDetect')}
            </Text>
            <Image
              source={require("../assets/swipeicon.png")}
              resizeMode="contain"
              style={styles.swipeImage}
            />
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>{I18n.t('tryBlinkingEyes')}</Text>
            <Text style={styles.body}>{I18n.t('doesSignalChange')}</Text>
            <Text style={styles.body}>
				{I18n.t('eyeMovementCreates')}<PopUpLink onPress={() => this.setState({ popUp2Visible: true })}>{I18n.t('noiseLink')}</PopUpLink>{I18n.t('inEEGSignal')}
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>{I18n.t('tryThinkingAbout')}</Text>
            <Text style={styles.body}>{I18n.t('doesSignalChange')}</Text>
            <Text style={styles.body}>
				{I18n.t('althoughEEG')}<PopUpLink onPress={() => this.setState({ popUp3Visible: true })}>{I18n.t('readingMindsLink')}</PopUpLink>.
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>{I18n.t('tryClosingEyes10')}</Text>
            <Text style={styles.body}>
				{I18n.t('mayNoticeSignalChange')}<PopUpLink onPress={() => this.setState({ popUp4Visible: true })}>{I18n.t('alphaWavesLink')}</PopUpLink>
            </Text>
            <LinkButton path="/slideTwo">{I18n.t('nextLink')}</LinkButton>
          </View>

        </ViewPagerAndroid>

        <PopUp
          onClose={() => this.setState({ popUp1Visible: false })}
          visible={this.state.popUp1Visible}
          title={I18n.t('whatIsEEGTitle')}
          image={require("../assets/hansberger.jpg")}
        >
			{I18n.t('whatIsEEGDescription')}
		</PopUp>

        <PopUp
          onClose={() => this.setState({ popUp2Visible: false })}
          visible={this.state.popUp2Visible}
          title={I18n.t('noiseTitle')}
        >
			{I18n.t('noiseDescription')}
        </PopUp>

        <PopUp
          onClose={() => this.setState({ popUp3Visible: false })}
          visible={this.state.popUp3Visible}
          title={I18n.t('cannotReadMindsTitle')}
        >
			{I18n.t('cannotReadMindsDescription')}
        </PopUp>

        <PopUp
          onClose={() => this.setState({ popUp4Visible: false })}
          visible={this.state.popUp4Visible}
          title={I18n.t('eyeRythymsTitle')}
        >
			{I18n.t('eyeRythymsDescription')}
        </PopUp>

        <PopUp
          onClose={()=>this.props.history.push('/connectorOne')}
          visible={
            this.props.connectionStatus === config.connectionStatus.DISCONNECTED
          }
          title={I18n.t('museDisconnectedTitle')}
        >
			{I18n.t('museDisconnectedDescription')}
        </PopUp>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SlideOne);

// Darker: #72C2F1
// Light: #97D2FC
const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    pageStyle: {
      padding: 15,
      alignItems: "stretch",
      justifyContent: "space-around"
    },

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
      flex: 4,
      justifyContent: "center",
      alignItems: "stretch"
    },

    sandboxButtonContainer: {
      position: "absolute",
      right: 5,
      top: 5
    },

    header: {
      fontFamily: "Roboto-Bold",
      color: "#484848",
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
