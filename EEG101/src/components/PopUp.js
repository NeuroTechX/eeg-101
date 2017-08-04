// PopUp.js
// A popup modal containing extra info.
// Can accept a title prop that will be display as header text at top of the popup text
// Image source passed as image prop will be displayed in black region at the top of the popup
// onClose is called when the Close button is clicked. Must be an arrow function that changes an isVisible prop in the parent component to false
// visible must be a boolean state in the parent component

import React, { Component } from "react";
import { Text, View, Modal, StyleSheet, Image } from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";
import Button from "../components/Button";
import I18n from "../i18n/i18n";
import * as colors from "../styles/colors";

export default class PopUp extends Component {
  render() {
    let imageStyle = this.props.image != null
      ? styles.activeImage
      : styles.disabledImage;
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        onRequestClose={this.props.onClose}
        visible={this.props.visible}
      >
        <View style={styles.modalBackground}>
          <View style={{ backgroundColor: "#1B1B1B" }}>
            <Image
              source={this.props.image}
              style={imageStyle}
              resizeMode="contain"
            />
          </View>
          <View style={styles.modalInnerContainer}>
            <Text style={styles.modalTitle}>{this.props.title}</Text>
            <Text style={styles.modalText}>{this.props.children}</Text>
            <Button onPress={this.props.onClose}>
              {I18n.t("closeButton")}
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "stretch",
      padding: 20,
      backgroundColor: colors.modalBlue
    },

    modalText: {
      fontFamily: "Roboto-Light",
      color: colors.black,
      fontSize: 15,
      margin: 5
    },

    modalTitle: {
      fontFamily: "Roboto-Bold",
      color: colors.black,
      fontSize: 20,
      margin: 5
    },

    modalInnerContainer: {
      alignItems: "stretch",
      backgroundColor: colors.white,
      padding: 20,
      elevation: 5,
      borderRadius: 4,
    },

    activeImage: {
      alignSelf: "center",
      height: 150,
      margin: 10
    },

    disabledImage: {
      height: 0,
      width: 0
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      modalBackground: {
        backgroundColor: colors.modalTransparent,
        justifyContent: "flex-end",
        paddingBottom: 50
      },

      activeImage: {
        height: 300,
        width: 300
      },

      modalTitle: {
        fontSize: 30
      },

      modalText: {
        fontSize: 18
      }
    },
    "@media (min-device-height: 1000)": {
      modalBackground: {
        paddingBottom: 100,
        paddingLeft: 120,
        paddingRight: 120
      }
    }
  }
);
