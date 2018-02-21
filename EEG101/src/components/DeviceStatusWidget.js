// DeviceStatusWidget.js
// A small widget displaying connection status of current device

import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import config from "../redux/config";
import I18n from "../i18n/i18n";
import { MediaQueryStyleSheet } from "react-native-responsive";
import * as colors from "../styles/colors";

import WhiteLinkButton from "../components/WhiteLinkButton.js";

export default class DeviceStatusWidget extends Component {
  constructor(props) {
    super(props);
  }

  renderConnectorLink() {
    if (this.props.connectionStatus !== config.connectionStatus.CONNECTED) {
      return (
        <WhiteLinkButton path="/connectorOne" replace={false}>
          CONNECT
        </WhiteLinkButton>
      );
    }
  }

  render() {
    switch (this.props.connectionStatus) {
      case config.connectionStatus.CONNECTED:
        connectionString = I18n.t("widgetConnected");
        dynamicTextStyle = styles.connected;
        break;

      case config.connectionStatus.NO_MUSES:
      case config.connectionStatus.NOT_YET_CONNECTED:
      case config.connectionStatus.DISCONNECTED:
        connectionString = I18n.t("widgetDisconnected");
        dynamicTextStyle = styles.disconnected;
        break;

      case config.connectionStatus.CONNECTING:
        connectionString = I18n.t("widgetConnecting");
        dynamicTextStyle = styles.connecting;
        break;
    }
    if (this.props.isOfflineMode) {
      connectionString = "Offline Mode";
      imageSource = require("../assets/nomuseiconwhite.png");
    } else {
      imageSource = require("../assets/museiconwhite.png");
    }

    return (
      <View style={styles.widgetContainer}>
        <View style={styles.textContainer}>
          <Image
            style={styles.image}
            source={imageSource}
            resizeMode="contain"
          />
          <Text style={dynamicTextStyle}>{connectionString}</Text>
        </View>
        {this.renderConnectorLink()}
      </View>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  {
    widgetContainer: {
      flex: 1
    },

    textContainer: {
      flex: 2.5,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      margin: 20,
      marginBottom: 0
    },

    image: {
      height: 40,
      width: 40
    },

    connected: {
      fontFamily: "Roboto-Light",
      fontSize: 20,
      color: colors.white
    },

    disconnected: {
      fontFamily: "Roboto-Light",
      fontSize: 20,
      color: colors.white
    },

    connecting: {
      fontFamily: "Roboto-Light",
      fontSize: 20,
      color: colors.turquoise
    }
  },
  {
    "@media (min-device-height: 700)": {
      widgetContainer: {
        alignItems: "center"
      }
    }
  }
);
