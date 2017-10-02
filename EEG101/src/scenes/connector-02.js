import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import config from "../redux/config";
import LinkButton from "../components/WhiteLinkButton";
import WhiteButton from "../components/WhiteButton";
import ConnectorWidget from "../components/ConnectorWidget";
import I18n from "../i18n/i18n";
import * as colors from "../styles/colors";

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
  };
}

class ConnectorTwo extends Component {
  constructor(props) {
    super(props);
  }

  renderButton() {
    if (
      this.props.connectionStatus === config.connectionStatus.CONNECTED
    ) {
      return (
        <LinkButton path="/connectorThree">
          {I18n.t("getStartedLink")}
        </LinkButton>
      );
    } else return (
        <WhiteButton onPress={() => null} disabled={true}>
          {I18n.t("getStartedLink")}
        </WhiteButton>
      );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>
            {I18n.t("step2Title")}
          </Text>
          <Text style={styles.instructions}>
            {I18n.t("waitMusePair")}
          </Text>
        </View>
        <ConnectorWidget />
        <View style={styles.buttonContainer}>
          {this.renderButton()}
        </View>
      </View>
    );
  }
}
export default connect(mapStateToProps)(ConnectorTwo);

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    body: {
      fontFamily: "Roboto-Light",
      fontSize: 15,
      margin: 20,
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
      justifyContent: "space-around",
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
