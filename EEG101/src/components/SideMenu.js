// SideMenu.js
// A sliding side menu for displaying settings and connect links
// Based on react-native-side-menu

import React, { Component } from "react";
import { ScrollView } from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { setMenu } from "../redux/actions";
import { bindActionCreators } from "redux";
import config from "../redux/config.js";
import DeviceStatusWidget from "./DeviceStatusWidget";
import MenuSection from "./MenuSection.js";
import I18n from "../i18n/i18n";
import LineNoisePicker from "./LineNoisePicker";
import * as colors from "../styles/colors";

function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
    isOfflineMode: state.isOfflineMode
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setMenu
    },
    dispatch
  );
}

class SideMenu extends Component {
  constructor(props) {
    super(props);
    props.history.listen(() => props.setMenu(false));
  }

  navTo(path) {
    this.props.history.push(path);
  }

  render() {
    if (!this.props.isOfflineMode) {
      return (
        <ScrollView style={styles.menuContainer}>
          <DeviceStatusWidget
            connectionStatus={this.props.connectionStatus}
            isOfflineMode={this.props.isOfflineMode}
          />

          <MenuSection
            title={I18n.t("toolsTitle")}
            items={[
              {
                //icon: "face",
                value: I18n.t("eegSandbox"),
                disabled:
                  this.props.connectionStatus !==
                  config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/sandbox",
                onPress: () => this.navTo("/sandbox")
              },
              {
                //icon: "face",
                value: I18n.t("bciValue"),
                disabled:
                  this.props.connectionStatus !==
                  config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/bciTrain",
                onPress: () => this.navTo("/bciTrain")
              }
            ]}
          />
          <MenuSection
            title={I18n.t("tutorialTitle")}
            items={[
              {
                //icon: "face",
                value: I18n.t("introductionValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/slideOne",
                onPress: () => this.navTo("/slideOne")
              },
              {
                //icon: "face",
                value: I18n.t("physiologyValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/slideTwo",
                onPress: () => this.navTo("/slideTwo")
              },
              {
                //icon: "face",
                value: I18n.t("hardwareValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/slideThree",
                onPress: () => this.navTo("/slideThree")
              },
              {
                //icon: "face",
                value: I18n.t("filteringValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/slideFour",
                onPress: () => this.navTo("/slideFour")
              },
              {
                //icon: "face",
                value: I18n.t("epochingValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/slideFive",
                onPress: () => this.navTo("/slideFive")
              },
              {
                //icon: "face",
                value: I18n.t("artefactValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/slideSix",
                onPress: () => this.navTo("/slideSix")
              },
              {
                //icon: "face",
                value: I18n.t("featureValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/slideSeven",
                onPress: () => this.navTo("/slideSeven")
              },
              {
                //icon: "face",
                value: I18n.t("psdValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/slideEight",
                onPress: () => this.navTo("/slideEight")
              },
              {
                //icon: "face",
                value: I18n.t("brainWavesValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/slideNine",
                onPress: () => this.navTo("/slideNine")
              },
              {
                //icon: "face",
                value: I18n.t("brainComputerInterfaceValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/bciOne",
                onPress: () => this.navTo("/bciOne")
              },
              {
                //icon: "face",
                value: I18n.t("howBuildBciValue"),
                disabled:
                  this.props.connectionStatus !==
                  config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/bciTwo",
                onPress: () => this.navTo("/bciTwo")
              },
              {
                //icon: "face",
                value: I18n.t("infoValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/end",
                onPress: () => this.navTo("/end")
              }
            ]}
          />
          <LineNoisePicker />
        </ScrollView>
      );
    } else
      return (
        <ScrollView style={styles.menuContainer}>
          <DeviceStatusWidget
            connectionStatus={this.props.connectionStatus}
            isOfflineMode={this.props.isOfflineMode}
          />

          <MenuSection
            title={I18n.t("toolsTitle")}
            items={[
              {
                //icon: "face",
                value: I18n.t("eegSandbox"),
                disabled:
                  this.props.connectionStatus !==
                  config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/sandbox",
                onPress: () => this.navTo("/sandbox")
              },
              {
                //icon: "face",
                value: I18n.t("bciValue"),
                disabled:
                  this.props.connectionStatus !==
                  config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/bciTrain",
                onPress: () => this.navTo("/bciTrain")
              }
            ]}
          />
          <MenuSection
            title={I18n.t("tutorialTitle")}
            items={[
              {
                //icon: "face",
                value: I18n.t("introductionValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/offline/slideOne",
                onPress: () => this.navTo("/offline/slideOne")
              },
              {
                //icon: "face",
                value: I18n.t("physiologyValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/offline/slideTwo",
                onPress: () => this.navTo("/offline/slideTwo")
              },
              {
                //icon: "face",
                value: I18n.t("hardwareValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/offline/slideThree",
                onPress: () => this.navTo("/offline/slideThree")
              },
              {
                //icon: "face",
                value: I18n.t("filteringValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.name === "/offline/slideFour",
                onPress: () => this.navTo("/offline/slideFour")
              },
              {
                //icon: "face",
                value: I18n.t("epochingValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/offline/slideFive",
                onPress: () => this.navTo("/offline/slideFive")
              },
              {
                //icon: "face",
                value: I18n.t("artefactValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/offline/slideSix",
                onPress: () => this.navTo("/offline/slideSix")
              },
              {
                //icon: "face",
                value: I18n.t("featureValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/offline/slideSeven",
                onPress: () => this.navTo("/offline/slideSeven")
              },
              {
                //icon: "face",
                value: I18n.t("psdValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/offline/slideEight",
                onPress: () => this.navTo("/offline/slideEight")
              },
              {
                //icon: "face",
                value: I18n.t("brainWavesValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/offline/slideNine",
                onPress: () => this.navTo("/offline/slideNine")
              },
              {
                //icon: "face",
                value: I18n.t("brainComputerInterfaceValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/bciOne",
                onPress: () => this.navTo("/bciOne")
              },
              {
                //icon: "face",
                value: I18n.t("howBuildBciValue"),
                disabled:
                  this.props.connectionStatus !==
                  config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/bciTwo",
                onPress: () => this.navTo("/bciTwo")
              },
              {
                //icon: "face",
                value: I18n.t("infoValue"),
                disabled:
                  !this.props.isOfflineMode &&
                  this.props.connectionStatus !==
                    config.connectionStatus.CONNECTED,
                active: this.props.location.pathname === "/end",
                onPress: () => this.navTo("/end")
              }
            ]}
          />
        </ScrollView>
      );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SideMenu)
);

const styles = MediaQueryStyleSheet.create(
  {
    menuContainer: {
      flex: 1,
      backgroundColor: colors.englishBlue
    }
  },
  {
    "@media (min-device-height: 700)": {}
  }
);
