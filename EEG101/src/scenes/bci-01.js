import React, { Component } from "react";

import { Text, View, ViewPagerAndroid, Image } from "react-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import I18n from "../i18n/i18n";
import LinkButton from "../components/LinkButton";
import PopUp from "../components/PopUp";
import PopUpList from "../components/PopUpList.js";
import ListItemBlock from "../components/ListItemBlock.js";
import PopUpLink from "../components/PopUpLink";
import config from "../redux/config.js";
import * as colors from "../styles/colors";

function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
    dimensions: state.graphViewDimensions,
    isOfflineMode: state.isOfflineMode
  };
}

class BCIOne extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUp1Visible: false,
      popUp2Visible: false
    };
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.graphContainer}>
          <Image
            source={require("../assets/bci_diagram.png")}
            style={styles.image}
            resizeMode={"contain"}
          />
        </View>
        <Text style={styles.currentTitle}>{I18n.t('bciTitle')}</Text>

        <ViewPagerAndroid style={styles.viewPager} initialPage={0}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>{I18n.t('whatIsBci')}</Text>
            <Text style={styles.body}>{I18n.t('bciDefinition1')}{' '}
              <PopUpLink onPress={() => this.setState({ popUp1Visible: true })}>
                {I18n.t('bciDefinition2')}
              </PopUpLink>{' '}
              {I18n.t('bciDefinition3')}
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>{I18n.t('makeUseBci')}</Text>
            <Text style={styles.body}>
              {I18n.t('recognizePatternBrain')}{' '}
              <PopUpLink onPress={() => this.setState({ popUp2Visible: true })}>
                {I18n.t('machineLearning')}
              </PopUpLink>
            </Text>
            <LinkButton path={this.props.isOfflineMode ? "/end" : "/bciTwo"}> {this.props.isOfflineMode ? 'END' : I18n.t('buildBci')} </LinkButton>
          </View>

        </ViewPagerAndroid>

        <PopUpList
          title={I18n.t('bciInteractionTitle')}
          onClose={() => this.setState({ popUp1Visible: false })}
          visible={this.state.popUp1Visible}
        >
          <ListItemBlock title="Active">{I18n.t('activeBci')}</ListItemBlock>
          <ListItemBlock title="Reactive">{I18n.t('reactiveBci')}</ListItemBlock>
          <ListItemBlock title="Passive">{I18n.t('passiveBci')}</ListItemBlock>
        </PopUpList>

        <PopUp
          onClose={() => this.setState({ popUp2Visible: false })}
          visible={this.state.popUp2Visible}
          title={I18n.t('machineLearningTitle')}
        > {I18n.t('machineLearningDefinition')} </PopUp>

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

export default connect(mapStateToProps)(BCIOne);

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
      backgroundColor: colors.malibu,
      flex: 4,
      justifyContent: "center",
      alignItems: "stretch"
    },

    image: {
      flex: 1,
      width: null,
      height: null
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
