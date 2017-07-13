// MenuSection.js
// Child component for SideMenu

import React, { Component, PropTypes } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";

export default class MenuSection extends Component {
  constructor(props) {
    super(props);
  }

  renderRow(item, index) {
    return (
      <TouchableOpacity key={index} disabled={item.disabled} onPress={item.onPress}>
        <View style={item.active ? {backgroundColor: "#459acc"} : {}}>
        <View style={styles.item}>
          <View style={styles.label}>
            <Text style={item.disabled ? styles.disabledItemLabel : styles.itemLabel}>
              {index+1}.
            </Text>
          </View>
          <View style={styles.value}>
            <Text style={item.disabled ? styles.disabledItemValue :styles.itemValue}>
              {item.value}
            </Text>
          </View>
        </View>
      </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>
          {this.props.title}
        </Text>
        {this.props.items.map((item, i) => {return(
          this.renderRow(item, i))
        })}
      </View>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    section: {
      flex: 1,
      marginTop: 8,
      justifyContent: "flex-start"
    },

    menuText: {
      margin: 10,
      fontSize: 20
    },

    title: {
      paddingLeft: 16,
      fontFamily: "Roboto-Bold",
      color: "#ffffff",
      fontSize: 18
    },

    item: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      height: 48,
      paddingLeft: 16,
      flexWrap: "wrap"
    },

    icon: {
      position: "absolute",
      top: 13
    },

    value: {
      flex: 1,
      top: 2
    },

    itemValue: {
      color: "#ffffff",
      fontFamily: "Roboto-Light",
      fontSize: 15
    },

    disabledItemValue: {
      color: "#adadad",
      fontFamily: "Roboto-Light",
      fontSize: 15
    },

    label: {
      paddingRight: 10,
      top: 2,
      width: 35,
    },

    itemLabel: {
      color: "#ffffff",
      fontFamily: "Roboto-Light",
      fontSize: 15
    },

    disabledItemLabel: {
      color: "#adadad",
      fontFamily: "Roboto-Light",
      fontSize: 15
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {},
    "@media (min-device-height: 1000)": {}
  }
);
