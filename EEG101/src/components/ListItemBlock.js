// ListItemBlock.js
// Child component for  ListView component.

import React, { Component } from "react";
import { MediaQueryStyleSheet } from "react-native-responsive";
import { Text, View } from "react-native";
import * as colors from "../styles/colors";

class ListItemBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{this.props.title}</Text>
        </View>
        <View>
          <Text style={styles.bodyText}>{this.props.children}</Text>
        </View>
      </View>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    container: {
      borderRadius: 3,
      backgroundColor: colors.white,
      margin: 10,
      marginVertical: 10,
      overflow: "hidden",
      elevation: 2
    },
    titleContainer: {
      backgroundColor: colors.faintBlue,
      paddingHorizontal: 10,
      paddingVertical: 5
    },
    titleText: {
      fontFamily: "Roboto-Bold",
      color: colors.black,
      fontSize: 20,
      margin: 5
    },

    bodyText: {
      padding: 5,
      fontFamily: "Roboto-Light",
      color: colors.black,
      fontSize: 15,
      margin: 5
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {

      container: {
        marginVertical: 40,
      },
      
      titleText: {
        fontSize: 25
      },

      bodyText: {
        padding: 10,
        fontSize: 20
      }
    }
  }
);

module.exports = ListItemBlock;
