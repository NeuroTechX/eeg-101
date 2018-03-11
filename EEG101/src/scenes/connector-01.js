import React, { Component } from "react";
import { Text, View, PermissionsAndroid } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import LinkButton from "../components/WhiteLinkButton";
import SandboxButton from "../components/SandboxButton";
import I18n from "../i18n/i18n";
import * as colors from "../styles/colors";
import { setOfflineMode, initNativeEventListeners } from "../redux/actions";

function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
    isOfflineMode: state.isOfflineMode
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setOfflineMode,
      initNativeEventListeners
    },
    dispatch
  );
}

class ConnectorOne extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.requestLocationPermission()
    this.props.initNativeEventListeners();
  }

  // Checks if user has enabled coarse location permission neceessary for BLE function
  // If not, displays request popup
  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: I18n.t("needsPermission"),
          message: I18n.t("requiresLocation")
        }
      );
    } catch (err) {
      console.warn(err);
    }
  }

  renderButton() {
    if (this.props.isOfflineMode) {
      return (
        <LinkButton path="/offline/slideOne">
          {I18n.t("getStartedLink")}
        </LinkButton>
      );
    } else
      return (
        <LinkButton path="/ConnectorTwo">{I18n.t("connector2Link")}</LinkButton>
      );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>{I18n.t("step1Title")}</Text>
          <Text style={styles.instructions}>
            {I18n.t("musePowerOnWarning")}
          </Text>
          <Text style={styles.body}>{I18n.t("museFirstGenWarning")}</Text>
        </View>
        <View style={styles.offlineButtonContainer}>
          <SandboxButton
            onPress={() => this.props.setOfflineMode(!this.props.isOfflineMode)}
            active={this.props.isOfflineMode}
          >
            {this.props.isOfflineMode
              ? I18n.t("offlineModeDisable")
              : I18n.t("offlineModeEnable")}
          </SandboxButton>
        </View>
        <View style={styles.buttonContainer}>{this.renderButton()}</View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectorOne);

const styles = MediaQueryStyleSheet.create(
  {
    // Base styles
    body: {
      fontFamily: "Roboto-Light",
      fontSize: 15,
      marginLeft: 40,
      marginRight: 40,
      color: colors.white,
      textAlign: "center"
    },

    instructions: {
      fontFamily: "Roboto-Bold",
      fontSize: 18,
      margin: 20,
      color: colors.white,
      textAlign: "center"
    },

    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "stretch",
      width: null,
      height: null,
      backgroundColor: colors.skyBlue
    },

    buttonContainer: {
      flex: 1,
      margin: 40,
      justifyContent: "center"
    },

    offlineButtonContainer: {
      flex: 1,
      margin: 10,
      justifyContent: "center",
      alignSelf: "center"
    },

    logo: {
      width: 50,
      height: 50
    },

    title: {
      textAlign: "center",
      margin: 15,
      lineHeight: 50,
      color: colors.white,
      fontFamily: "Roboto-Black",
      fontSize: 48
    },

    titleBox: {
      flex: 3,
      alignItems: "center",
      justifyContent: "center"
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      body: {
        fontSize: 20,
        marginLeft: 50,
        marginRight: 50
      },

      instructions: {
        fontSize: 30
      }
    }
  }
);
