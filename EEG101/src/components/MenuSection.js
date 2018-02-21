// MenuSection.js
// Child component for SideMenu

import React, { Component  } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";
import * as colors from "../styles/colors";

export default class MenuSection extends Component {
  constructor(props) {
    super(props);
  }

  renderRow(item, index) {
    return (
      <TouchableOpacity key={index} disabled={item.disabled} onPress={item.onPress}>
        <View style={item.active ? {backgroundColor: colors.englishBlue} : {}}>
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

    title: {
      paddingLeft: 16,
      fontFamily: "Roboto-Bold",
      color: colors.white,
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
      color: colors.white,
      fontFamily: "Roboto-Light",
      fontSize: 15
    },

    disabledItemValue: {
      color: colors.heather,
      fontFamily: "Roboto-Light",
      fontSize: 15
    },

    label: {
      paddingRight: 10,
      top: 2,
      width: 35,
    },

    itemLabel: {
      color: colors.white,
      fontFamily: "Roboto-Light",
      fontSize: 15
    },

    disabledItemLabel: {
      color: colors.heather,
      fontFamily: "Roboto-Light",
      fontSize: 15
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {  
      title: {
        fontSize: 25
      },
  
      itemValue: {
        fontSize: 20
      },
  
      disabledItemValue: {
        fontSize: 20
      },

  
      itemLabel: {
        fontSize: 20
      },
  
      disabledItemLabel: {
        fontSize: 20
      }
    },
  }
);
