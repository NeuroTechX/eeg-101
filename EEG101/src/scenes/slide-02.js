import React, { Component } from "react";
import { Text, View, ViewPagerAndroid, Image } from "react-native";
import { connect } from "react-redux";
import config from "../redux/config";
import { MediaQueryStyleSheet } from "react-native-responsive";
import LinkButton from "../components/LinkButton";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";
import I18n from '../i18n/i18n';
import * as colors from "../styles/colors";

function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus
  };
}

class SlideTwo extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUp1Visible: false,
      popUp2Visible: false,
      popUp3Visible: false,
      slidePosition: 0
    };
  }

  render() {
    // Sets the source of the lesson image based on the position of the ViewPager
    const imageSource = slidePosition => {
      switch (slidePosition) {
        case 0:
          return require("../assets/neuronarrow.png");

        case 1:
          return require("../assets/neuronmultiarrow.png");

        case 2:
          return require("../assets/awakeasleep.gif");

      }
    };
    return (
      <View style={styles.container}>

        <View style={styles.graphContainer}>
          <Image
            source={imageSource(this.state.slidePosition)}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.currentTitle}>{I18n.t('physiologySlideTitle')}</Text>

        <ViewPagerAndroid // Allows us to swipe between child views
          style={styles.viewPager}
          initialPage={0}
          // Receives a native callback event e that is used to set slidePosition state
          onPageSelected={e =>
            this.setState({ slidePosition: e.nativeEvent.position })}
        >

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
				{I18n.t('EEGComeFrom')}
            </Text>
            <Text style={styles.body}>
				{I18n.t('EEGMeasures')}{' '}<PopUpLink onPress={() => this.setState({ popUp1Visible: true })}>{I18n.t('neuronsLink')}</PopUpLink>{' '}{I18n.t('receiveAndTransmit')}
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
				{I18n.t('organizedNeural')}
            </Text>
            <Text style={styles.body}>
				{I18n.t('whenBillionsOfNeurons')}{' '}<PopUpLink onPress={() => this.setState({ popUp2Visible: true })}>{I18n.t('workTogetherLink')}</PopUpLink>{' '}{I18n.t('produceThoughts')}
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
				{I18n.t('EEGDetects')}
            </Text>
            <Text style={styles.body}>
				{I18n.t('organizedElectricalActivity')}{' '}<PopUpLink onPress={() => this.setState({ popUp3Visible: true })}>{I18n.t('sleepWakefulnessLink')}</PopUpLink>
            </Text>
            <LinkButton path="./slideThree">{I18n.t('nextLink')}</LinkButton>
          </View>
        </ViewPagerAndroid>

        <PopUp
          onClose={() => this.setState({ popUp1Visible: false })}
          visible={this.state.popUp1Visible}
          title={I18n.t('neuralBasisEEGTitle')}
        >
			{I18n.t('neuralBasisEEGDescription1')}
        </PopUp>

        <PopUp
          onClose={() => this.setState({ popUp2Visible: false })}
          visible={this.state.popUp2Visible}
          title={I18n.t('neuralBasisEEGTitle')}
        >
			{I18n.t('neuralBasisEEGDescription2')}
        </PopUp>

        <PopUp
          onClose={() => this.setState({ popUp3Visible: false })}
          visible={this.state.popUp3Visible}
          title={I18n.t('brainStatesTitle')}
        >
			{I18n.t('brainStatesDescription')}
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

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    pageStyle: {
      padding: 20,
      alignItems: "stretch",
      justifyContent: "space-around"
    },

    image: {
      flex: 1,
      width: null,
      height: null
    },

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

export default connect(mapStateToProps)(SlideTwo);
