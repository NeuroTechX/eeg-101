import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Picker,
  Image,
  TouchableOpacity
} from "react-native";
import { Link } from "react-router-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import LinkButton from "../components/WhiteLinkButton";
import I18n from '../i18n/i18n';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus
  };
}

class ConnectorThree extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>{I18n.t('step3Title')}</Text>
          <Text style={styles.instructions}>{I18n.t('museFitProperly')}</Text>
          <Text style={styles.body}>{I18n.t('fitInstructions')}</Text>
        </View>

        <Link to={"/sandbox"} replace={true} component={TouchableOpacity}>
          <View
            style={{
              borderColor: "white",
              borderWidth: 1,
              alignSelf: "center",
              margin: 5,
              padding: 5
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Roboto-Bold",
                fontSize: 15
              }}
            >
              SANDBOX MODE
            </Text>
          </View>
        </Link>

        <Link to={"/bciOne"} component={TouchableOpacity}>
          <View
            style={{
              borderColor: "white",
              borderWidth: 1,
              alignSelf: "center",
              margin: 5,
              padding: 5
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Roboto-Bold",
                fontSize: 15
              }}
            >
              CLASSIFIER TEST
            </Text>
          </View>
        </Link>

        <TouchableOpacity onPress={() => Actions.Sandbox()} />

        <View style={styles.buttonContainer}>
          <LinkButton path="/slideOne"> BEGIN LESSON </LinkButton>
        </View>
      </View>
    );
  }
}
export default connect(mapStateToProps)(ConnectorThree);

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    body: {
      fontFamily: "Roboto-Light",
      fontSize: 15,
      marginLeft: 40,
      marginRight: 40,
      color: "#ffffff",
      textAlign: "center"
    },

    instructions: {
      fontFamily: "Roboto-Bold",
      fontSize: 18,
      margin: 20,
      color: "#ffffff",
      textAlign: "center"
    },

    container: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch",
      width: null,
      height: null,
      backgroundColor: "#6CCBEF"
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
      },

      instructions: {
        fontSize: 30
      }
    }
  }
);
