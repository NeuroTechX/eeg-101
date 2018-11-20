// NavBar.js
// A component with a NavBar and redux-integrated navigation that can be a parent to most scenes in the app

import React, { Component } from "react";
import { Image, View, Text, TouchableOpacity, NativeModules, NativeEventEmitter } from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { bindActionCreators } from "redux";
import { setMenu, setRefresh } from "../redux/actions";
import * as colors from "../styles/colors";
import Battery from "../native/Battery.js";
import config from "../redux/config";
import TimerMixin from "react-timer-mixin";

// We don't actually use isMenuOpen prop, but it feels good to have, eh?
function mapStateToProps(state) {
  return {
	connectionStatus: state.connectionStatus,
    isMenuOpen: state.isMenuOpen,
    refresh: state.refresh
  };
}


// Binds actions to component's props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setMenu,
	  setRefresh
    },
    dispatch
  );
}

class NavBar extends Component {
  constructor(props) {
    super(props);
	
    this.state = {
      batteryLevel: '',
    };
  }
  
  componentDidMount () {
    TimerMixin.setInterval(
      () => { this.props.setRefresh(!this.props.refresh); },
      1000
    );
  }

  setBattery = async () => {
    try {
      Battery.setBatteryListener();
      const scoreListener = new NativeEventEmitter(
        NativeModules.Battery
      );
      this.predictSubscription = scoreListener.addListener(
        "BATTERY", battery => {
          this.state.batteryLevel = battery;
        }
      );
    } catch (b) {
      console.log(b)
    }
  }

  renderTrick() {
    if (this.props.refresh === true) {
      return (
        <View>
        </View>
      );
    } else {
      return (
        <View>
        </View>
      );
    }
  }

  renderBatteryIcon() {
    if (this.props.connectionStatus === config.connectionStatus.CONNECTED) {
      if (this.state.batteryLevel === '') {
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
      } else if (this.state.batteryLevel > 75) {
        return (
          <View style={styles.batteryContainer}>
            <Text style={styles.batteryText}>{this.state.batteryLevel}% </Text>
            <Image
              style={styles.batteryStyle}
              source={require("../assets/battery100.png")}
              resizeMode={"contain"}
            />
          </View>
        );
      } else if (this.state.batteryLevel >50) {
        return  (
          <View style={styles.batteryContainer}>
            <Text style={styles.batteryText}>{this.state.batteryLevel}% </Text>
            <Image
              style={styles.batteryStyle}
              source={require("../assets/battery75.png")}
              resizeMode={"contain"}
            />
          </View>
        );
      } else if (this.state.batteryLevel > 25) {
        return  (
          <View style={styles.batteryContainer}>
            <Text style={styles.batteryText}>{this.state.batteryLevel}% </Text>
            <Image
              style={styles.batteryStyle}
              source={require("../assets/battery50.png")}
              resizeMode={"contain"}
            />
          </View>
        );
      } else if (this.state.batteryLevel > 5) {
        return  (
          <View style={styles.batteryContainer}>
            <Text style={styles.batteryText}>{this.state.batteryLevel}% </Text>
            <Image
              style={styles.batteryStyle}
              source={require("../assets/battery25.png")}
              resizeMode={"contain"}
            />
          </View>
        );
      } else if (this.state.batteryLevel <= 5) {
        return  (
          <View style={styles.batteryContainer}>
            <Text style={styles.lowBatteryText}>{this.state.batteryLevel}% </Text>
            <Image
              style={styles.batteryStyle}
              source={require("../assets/battery0.png")}
              resizeMode={"contain"}
            />
          </View>
        );
      }
    } else {
      return null;
    }
  }
  
  render() {
    if (this.props.connectionStatus === config.connectionStatus.CONNECTED) {
      this.setBattery();
    } 
    return (
      <View style={styles.navContainer}>
        <TouchableOpacity onPress={()=>this.props.setMenu(true)}>
          <Image
            style={styles.burger}
            source={require("../assets/burger.png")}
            resizeMode={"contain"}
          />
        </TouchableOpacity>
		{this.renderTrick()}
		{this.renderBatteryIcon()}
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
    },
	
    burger: {
      width: 30,
      height: 30
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {},
    "@media (min-device-height: 1000)": {}
  }
);
