// SideMenu.js
// A sliding side menu for displaying settings and connect links
// Based on react-native-side-menu

import React, { Component } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from "react-native";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { closeMenu } from "../redux/actions";
import { bindActionCreators } from "redux";
import config from "../redux/config.js";
import DeviceStatusWidget from "../components/DeviceStatusWidget.js";
import MenuSection from "../components/MenuSection.js";
import I18n from "../i18n/i18n";

function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      closeMenu
    },
    dispatch
  );
}

class SideMenu extends Component {
  constructor(props) {
    super(props);
    props.history.listen( location => {console.log('location changed')
    props.closeMenu()
  })
  }

  navTo(path){
    this.props.history.push(path)
  }

  render() {
    return (
      <ScrollView style={styles.menuContainer}>
        <DeviceStatusWidget connectionStatus={this.props.connectionStatus} />

        <MenuSection
          title={I18n.t('toolsTitle')}
          items={[
            {
              //icon: "face",
              value: {I18n.t('eegSandbox')},
              disabled:
                this.props.connectionStatus !==
                config.connectionStatus.CONNECTED,
              active: this.props.location.pathname === "/sandbox",
              onPress: () => this.navTo("/sandbox")
            },
            {
              //icon: "face",
              value: {I18n.t('bciValue')},
              disabled:
                this.props.connectionStatus !==
                config.connectionStatus.CONNECTED,
              active: this.props.location.pathname === "/bciTrain",
              onPress: () => this.navTo("/bciTrain")
            }
          ]}
        />
        <MenuSection
          title={I18n.t('tutorialTitle')}
          items={[
            {
              //icon: "face",
              value: {I18n.t('introductionValue')},
              disabled:
                this.props.connectionStatus !==
                config.connectionStatus.CONNECTED,
              active: this.props.location.pathname === "/slideOne",
              onPress: () => this.navTo("/slideOne")
            },
            {
              //icon: "face",
              value: {I18n.t('physiologyValue')},
              disabled:
                this.props.connectionStatus !==
                config.connectionStatus.CONNECTED,
              active: this.props.location.pathname === "/slideTwo",
              onPress: () => this.navTo("/slideTwo")
            },
            {
              //icon: "face",
              value: {I18n.t('hardwareValue')},
              disabled:
                this.props.connectionStatus !==
                config.connectionStatus.CONNECTED,
              active: this.props.location.pathname === "/slideThree",
              onPress: () => this.navTo("/slideThree")
            },
            {
              //icon: "face",
              value: {I18n.t('filteringValue')},
              disabled:
                this.props.connectionStatus !==
                config.connectionStatus.CONNECTED,
              active: this.props.location.pathname === "/slideFour",
              onPress: () => this.navTo("/slideFour")
            },
            {
              //icon: "face",
              value: {I18n.t('epochingValue')},
              disabled:
                this.props.connectionStatus !==
                config.connectionStatus.CONNECTED,
              active: this.props.location.pathname === "/slideFive",
              onPress: () => this.navTo("/slideFive")
            },
            {
              //icon: "face",
              value: {I18n.t('artefactValue')},
              disabled:
                this.props.connectionStatus !==
                config.connectionStatus.CONNECTED,
              active: this.props.location.pathname === "/slideSix",
              onPress: () => this.navTo("/slideSix")
            },
            {
              //icon: "face",
              value: {I18n.t('featureValue')},
              disabled:
                this.props.connectionStatus !==
                config.connectionStatus.CONNECTED,
              active: this.props.location.pathname === "/slideSeven",
              onPress: () => this.navTo("/slideSeven")
            },
            {
              //icon: "face",
              value: {I18n.t('psdValue')},
              disabled:
                this.props.connectionStatus !==
                config.connectionStatus.CONNECTED,
              active: this.props.location.pathname === "/slideEight",
              onPress: () => this.navTo("/slideEight")
            },
            {
              //icon: "face",
              value: {I18n.t('brainWavesValue')},
              disabled:
                this.props.connectionStatus !==
                config.connectionStatus.CONNECTED,
              active: this.props.location.pathname === "/slideNine",
              onPress: () => this.navTo("/slideNine")
            },
            {
              //icon: "face",
              value: {I18n.t('brainComputerInterfaceValue')},
              disabled:
                this.props.connectionStatus !==
                config.connectionStatus.CONNECTED,
              active: this.props.location.pathname === "/bciOne",
              onPress: () => this.navTo("/bciOne")
            },
            {
              //icon: "face",
              value: {I18n.t('howBuildBciValue')},
              disabled:
                this.props.connectionStatus !==
                config.connectionStatus.CONNECTED,
              active: this.props.location.pathname === "/bciTwo",
              onPress: () => this.navTo("/bciTwo")
            },
            {
              //icon: "face",
              value: {I18n.t('infoValue')},
              active: this.props.location.pathname === "/end",
              onPress: () => this.navTo("/end")
            }
          ]}
        />
      </ScrollView>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideMenu));

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: "#3f93c4"
  },

  image: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 8,
    width: "100%",
    height: 140
  }
});
