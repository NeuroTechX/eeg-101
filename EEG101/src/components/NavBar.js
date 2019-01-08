// NavBar.js
// A component with a NavBar and redux-integrated navigation that can be a parent to most scenes in the app

import React, { Component } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { bindActionCreators } from "redux";
import { setMenu } from "../redux/actions";
import * as colors from "../styles/colors";
import config from "../redux/config";

// We don't actually use this prop, but it feels good to have, eh?
function mapStateToProps(state) {
  return {
    isMenuOpen: state.isMenuOpen,
    connectionStatus: state.connectionStatus,
    batteryValue: state.batteryValue
  };
}


// Binds actions to component's props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setMenu
    },
    dispatch
  );
}

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  renderBatteryIcon() {   
    if (this.props.batteryValue === null) {
      return (
        <View style={styles.batteryContainer}>
          <Text style={styles.batteryText}>--- </Text>
          <Image
            style={styles.batteryStyle}
            source={require("../assets/battery.png")}
            resizeMode={"contain"}
          />
        </View>
      );
    } else if (this.props.batteryValue > 75) {
      return (
        <View style={styles.batteryContainer}>
          <Text style={styles.batteryText}>{this.props.batteryValue}% </Text>
          <Image
            style={styles.batteryStyle}
            source={require("../assets/battery100.png")}
            resizeMode={"contain"}
          />
        </View>
      );
    } else if (this.props.batteryValue >50) {
      return  (
        <View style={styles.batteryContainer}>
          <Text style={styles.batteryText}>{this.props.batteryValue}% </Text>
          <Image
            style={styles.batteryStyle}
            source={require("../assets/battery75.png")}
            resizeMode={"contain"}
          />
        </View>
      );
    } else if (this.props.batteryValue > 25) {
      return  (
        <View style={styles.batteryContainer}>
          <Text style={styles.batteryText}>{this.props.batteryValue}% </Text>
          <Image
            style={styles.batteryStyle}
            source={require("../assets/battery50.png")}
            resizeMode={"contain"}
          />
        </View>
      );
    } else if (this.props.batteryValue > 5) {
      return  (
        <View style={styles.batteryContainer}>
          <Text style={styles.batteryText}>{this.props.batteryValue}% </Text>
          <Image
            style={styles.batteryStyle}
            source={require("../assets/battery25.png")}
            resizeMode={"contain"}
          />
        </View>
      );
    } else if (this.props.batteryValue <= 5) {
      return  (
        <View style={styles.batteryContainer}>
          <Text style={styles.lowBatteryText}>{this.props.batteryValue}% </Text>
          <Image
            style={styles.batteryStyle}
            source={require("../assets/battery0.png")}
            resizeMode={"contain"}
          />
        </View>
      );
    }
  }

  renderNavBar() {
    if (this.props.connectionStatus === config.connectionStatus.CONNECTED) {
      return (
        <View style={styles.navContainer}>
          <TouchableOpacity onPress={()=>this.props.setMenu(true)}>
            <Image
              style={styles.burger}
              source={require("../assets/burger.png")}
              resizeMode={"contain"}
            />

          </TouchableOpacity>
          <View>
            {this.renderBatteryIcon()}
          </View>
        </View>
      );     
    } else {
      return (
        <View style={styles.navContainer}>
          <TouchableOpacity onPress={()=>this.props.setMenu(true)}>
            <Image
              style={styles.burger}
              source={require("../assets/burger.png")}
              resizeMode={"contain"}
            />

          </TouchableOpacity>
        </View>
      );        
    }
  }

  render() {
    return (
      <View>
        {this.renderNavBar()}
      </View>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    navContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 15,
      height: 45,
      backgroundColor: colors.englishBlue
    },

    burger: {
      width: 30,
      height: 30
    },

    batteryContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 5
    },

    batteryStyle: {
      width: 45
    },

    batteryText: {
      textAlign: "center",
      color: colors.white,
      fontFamily: "Roboto-Medium",
      fontSize: 15
    },

    lowBatteryText: {
      textAlign: "center",
      color: colors.red,
      fontFamily: "Roboto-Medium",
      fontSize: 15
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {},
    "@media (min-device-height: 1000)": {}
  }
);
