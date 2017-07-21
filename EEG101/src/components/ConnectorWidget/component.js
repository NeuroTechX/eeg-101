// ConnectorWidget.js
// An interface component with a picker and two buttons that handles connection to Muse devices

import React, { Component } from "react";
import {
  Text,
  View,
  DeviceEventEmitter,
  StyleSheet,
  PermissionsAndroid
} from "react-native";
import config from "../../redux/config";
import Connector from "../../interface/Connector";
import WhiteButton from "../WhiteButton";
import SandboxButton from "../SandboxButton.js";
import I18n from "../../i18n/i18n";

export default class ConnectorWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listeners: []
    };
  }

  // Checks if user has enabled coarse location permission neceessary for BLE function
  // If not, displays request popup, otherwise proceeds to startConnector()
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

  // Calls getAndConnectoToDevice in native ConnectorModule after creating promise listeners
  startConnector() {
    if (
      this.props.connectionStatus === config.connectionStatus.NOT_YET_CONNECTED
    ) {
      // This listener will update connection status if no Muses are found in getMuses call
      DeviceEventEmitter.addListener("NO_MUSES", event => {

        this.props.setConnectionStatus(config.connectionStatus.NO_MUSES);
      });

      // This listener will detect when the connector module enters the temporary 'connecting...' state
      DeviceEventEmitter.addListener("CONNECT_ATTEMPT", event => {
        this.props.setConnectionStatus(config.connectionStatus.CONNECTING);
      });

      // This creates a persistent listener that will update connectionStatus when connection events are broadcast in Java
      DeviceEventEmitter.addListener("DISCONNECTED", event => {
        this.props.setConnectionStatus(config.connectionStatus.DISCONNECTED);
      });

      DeviceEventEmitter.addListener("CONNECTED", event => {
        this.props.setConnectionStatus(config.connectionStatus.CONNECTED);
      });
    }

    if(this.props.connectionStatus != config.connectionStatus.CONNECTED){
      this.props.getAndConnectToDevice()
    }
  }

  // request location permissions and call getAndConnectToDevice and register event listeners when component loads
  componentDidMount() {
    this.requestLocationPermission();
    this.startConnector();
  }

  render() {
    // switch could also further functionality to handle multiple connection conditions
    switch (this.props.connectionStatus) {
      case config.connectionStatus.CONNECTED:
        connectionString = I18n.t("statusConnected");
        dynamicTextStyle = styles.connected;
        break;
      case config.connectionStatus.NO_MUSES:
        dynamicTextStyle = styles.noMuses;
        return (
          <View style={styles.container}>
            <Text style={dynamicTextStyle}>
              {I18n.t("statusNoMusesTitle")}
            </Text>
            <SandboxButton
              onPress={() =>
                this.props.setOfflineMode(!this.props.isOfflineMode)}
              active={this.props.isOfflineMode}
            >
              Enable Offline Mode (beta)
            </SandboxButton>

            <WhiteButton onPress={() => this.props.getAndConnectToDevice()}>
              {I18n.t("searchAgain")}
            </WhiteButton>
          </View>
        );
      case config.connectionStatus.CONNECTING:
        connectionString = I18n.t("statusConnecting");
        dynamicTextStyle = styles.connecting;
        break;
      case config.connectionStatus.NOT_YET_CONNECTED:
      case config.connectionStatus.DISCONNECTED:
        connectionString = I18n.t("statusDisconnected");
        dynamicTextStyle = styles.disconnected;
    }

    return (
      <View style={styles.textContainer}>
        <Text style={dynamicTextStyle}>
          {connectionString}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2.5,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginLeft: 50,
    marginRight: 50
  },

  buttonContainer: {
    flex: 1,
    margin: 40,
    justifyContent: "center"
  },

  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    margin: 40,
    padding: 5,
    backgroundColor: "#ffffff",
    borderRadius: 50
  },

  body: {
    fontFamily: "Roboto-Light",
    fontSize: 15,
    marginBottom: 5,
    color: "#ffffff",
    textAlign: "center"
  },

  connected: {
    fontFamily: "Roboto-Light",
    fontSize: 20,
    color: "#0ef357"
  },

  disconnected: {
    fontFamily: "Roboto-Light",
    fontSize: 20,
    color: "#f3410e",
    textAlign: "center"
  },

  noMuses: {
    fontFamily: "Roboto-Light",
    fontSize: 20,
    color: "#ffffff",
    textAlign: "center"
  },

  connecting: {
    fontFamily: "Roboto-Light",
    fontSize: 20,
    color: "#42f4d9"
  }
});
