import React, { Component } from "react";
import { Animated, StyleSheet, Text, View, Picker, Image } from "react-native";
import { Link } from "react-router-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import LinkButton from "../components/WhiteLinkButton";
import I18n from '../i18n/i18n';

// Sets isVisible prop by comparing state.scene.key (active scene) to this scene's ley
function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus
  };
}

class Landing extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Image
        source={require("../assets/clouds.png")}
        style={styles.container}
        resizeMode="stretch"
      >
        <View style={styles.titleBox}>
          <Text style={styles.title}>{I18n.t('welcomeEEG101')}</Text>
          <Text style={styles.body}>{I18n.t('tutorialDescription')}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <LinkButton path="/connectorOne">{I18n.t('getStartedLink')}</LinkButton>
        </View>
      </Image>
    );
  }
}
export default connect(mapStateToProps)(Landing);

const styles = MediaQueryStyleSheet.create(
  {
    // Base styles
    body: {
      fontFamily: "Roboto-Light",
      fontSize: 15,
      margin: 20,
      color: "#ffffff",
      textAlign: "center"
    },

    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "stretch",
      width: null,
      height: null,
      backgroundColor: "rgba(0,0,0,0)"
    },

    buttonContainer: {
      flex: 1,
      margin: 40,
      justifyContent: "center"
    },

    logo: {
      width: 50,
      height: 50
    },

    title: {
      textAlign: "center",
      margin: 15,
      lineHeight: 50,
      color: "#ffffff",
      fontFamily: "Roboto-Black",
      fontSize: 48
    },

    titleBox: {
      flex: 4,
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
      }
    }
  }
);
