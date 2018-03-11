// ConnectorWidget.js
// An interface component with a picker and two buttons that handles connection to Muse devices

import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Modal,
  ScrollView,
  ActivityIndicator,
  Image
} from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";
import config from "../../redux/config";
import Connector from "../../native/Connector";
import WhiteButton from "../WhiteButton";
import Button from "../Button.js";
import I18n from "../../i18n/i18n";
import * as colors from "../../styles/colors";

class MusesPopUp extends Component {
  constructor(props) {
    super(props);
  }

  renderRow(muse, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          this.props.onPress(index);
        }}
      >
        <View
          style={
            this.props.selectedMuse === index
              ? { backgroundColor: colors.faintBlue }
              : {}
          }
        >
          <View style={styles.item}>
            <View style={styles.label}>
              <Text style={styles.itemText}>{index + 1}.</Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.itemText}>{muse.name}</Text>
            </View>
            <Text style={styles.itemText}>Model: {muse.model}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        onRequestClose={this.props.onClose}
        visible={this.props.visible}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalInnerContainer}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.modalTitle}>Available Muses</Text>
              <TouchableOpacity onPress={() => Connector.refreshMuseList()}>
                <Image
                  source={require("../../assets/refresh.png")}
                  resizeMode={"contain"}
                  style={styles.refreshButton}
                />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              {this.props.availableMuses.map((muse, i) => {
                return this.renderRow(muse, i);
              })}
            </ScrollView>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Button
                  onPress={() =>
                    Connector.connectToMuseWithIndex(this.props.selectedMuse)
                  }
                >
                  {I18n.t("connectButton")}
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button onPress={this.props.onClose}>
                  {I18n.t("closeButton")}
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default class ConnectorWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      musePopUpIsVisible: false,
      selectedMuse: 0
    };
  }

  componentWillMount(){
    Connector.startConnector();
  }

  // Might want to push some more of this logic into Redux actions
  getAndConnectToDevice() {
    this.props.setConnectionStatus(config.connectionStatus.SEARCHING);
    setTimeout(
      () =>
        this.props.getMuses().then(action => {
          if (action.payload.length > 1) {
            this.setState({ musePopUpIsVisible: true });
          } else if (action.payload.length === 1) {
            Connector.connectToMuseWithIndex(0);
          }
        }),
      2000
    );
  }

  render() {
    switch (this.props.connectionStatus) {
      case config.connectionStatus.NOT_YET_CONNECTED:
      case config.connectionStatus.DISCONNECTED:
      case config.connectionStatus.NO_MUSES:
      default:
        return (
          <View style={styles.container}>
            <Text style={styles.noMuses}>No connected Muse</Text>
            <WhiteButton onPress={() => this.getAndConnectToDevice()}>
              SEARCH
            </WhiteButton>
          </View>
        );

      case config.connectionStatus.BLUETOOTH_DISABLED:
        return (
          <View style={styles.container}>
            <Text style={styles.noMuses}>
              Bluetooth appears to be disabled!
            </Text>
            <WhiteButton onPress={() => this.getAndConnectToDevice()}>
              SEARCH
            </WhiteButton>
          </View>
        );

      case config.connectionStatus.SEARCHING:
        return (
          <View style={styles.container}>
            <MusesPopUp
              onPress={index => this.setState({ selectedMuse: index })}
              selectedMuse={this.state.selectedMuse}
              visible={this.state.musePopUpIsVisible}
              onClose={() => {
                this.props.setConnectionStatus(
                  config.connectionStatus.DISCONNECTED
                );
                this.setState({ musePopUpIsVisible: false });
              }}
              availableMuses={this.props.availableMuses}
            />

            <View style={styles.connectingContainer}>
              <ActivityIndicator color={"#94DAFA"} size={"large"} />
              <Text style={styles.connecting}>Searching...</Text>
            </View>
          </View>
        );

      case config.connectionStatus.CONNECTING:
        return (
          <View style={styles.container}>
            <View style={styles.connectingContainer}>
              <ActivityIndicator color={"#94DAFA"} size={"large"} />
              <View>
                <Text style={styles.connecting}>Connecting...</Text>
                <Text style={styles.connectingName}>
                  {this.props.availableMuses[this.state.selectedMuse].name}
                </Text>
              </View>
            </View>
          </View>
        );

      case config.connectionStatus.CONNECTED:
        return (
          <View style={styles.container}>
            <View style={styles.connectingContainer}>
              <Text style={styles.connected}>Connected</Text>
            </View>
          </View>
        );
    }
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    container: {
      flex: 2.5,
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "stretch",
      marginLeft: 50,
      marginRight: 50
    },

    connectingContainer: {
      alignSelf: "center",
      borderRadius: 50,
      backgroundColor: colors.white,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      padding: 20,
      height: 70,
      width: 240
    },

    body: {
      fontFamily: "Roboto-Light",
      fontSize: 15,
      marginBottom: 5,
      color: colors.white,
      textAlign: "center"
    },

    connected: {
      fontFamily: "Roboto",
      fontSize: 20,
      color: colors.malachite
    },

    disconnected: {
      fontFamily: "Roboto",
      fontSize: 20,
      color: colors.pomegranate,
      textAlign: "center"
    },

    noMuses: {
      fontFamily: "Roboto",
      fontSize: 20,
      color: colors.white,
      textAlign: "center"
    },

    connecting: {
      fontFamily: "Roboto",
      fontSize: 20,
      color: colors.turquoise
    },

    connectingName: {
      fontFamily: "Roboto-Light",
      fontSize: 18,
      color: colors.turquoise
    },

    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "stretch",
      padding: 20,
      backgroundColor: colors.modalBlue
    },

    modalTitle: {
      flex: 1,
      fontFamily: "Roboto-Bold",
      color: colors.black,
      fontSize: 20,
      margin: 5
    },

    scrollViewContainer: {
      marginTop: 20,
      marginBottom: 20
    },

    modalInnerContainer: {
      alignItems: "stretch",
      backgroundColor: colors.white,
      padding: 20,
      elevation: 4,
      borderRadius: 4
    },

    close: {
      alignSelf: "center",
      padding: 20,
      fontSize: 22
    },

    item: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      height: 48,
      paddingLeft: 16,
      paddingRight: 16,
      flexWrap: "wrap"
    },

    refreshButton: {
      width: 30,
      height: 30
    },

    icon: {
      position: "absolute",
      top: 13
    },

    label: {
      paddingRight: 10,
      top: 2,
      width: 35
    },

    value: {
      flex: 1,
      top: 2
    },

    itemText: {
      color: colors.black,
      fontFamily: "Roboto-Light",
      fontSize: 19
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      modalBackground: {
        paddingTop: 100,
        backgroundColor: colors.modalTransparent
      }
    },
    "@media (min-device-height: 1000)": {
      modalBackground: {
        paddingTop: 200
      }
    }
  }
);
