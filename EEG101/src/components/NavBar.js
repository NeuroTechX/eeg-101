// NavBar.js
// A component with a NavBar and redux-integrated navigation that can be a parent to most scenes in the app

import React, { Component } from "react";
import { Link } from "react-router-native";
import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";
import { connect } from "react-redux";
import config from "../redux/config";
import { bindActionCreators } from "redux";
import { toggleMenu } from "../redux/actions";

function mapStateToProps(state) {
  return {

  };
}


// Binds actions to component's props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleMenu
    },
    dispatch
  );
}

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.navContainer}>
        <TouchableOpacity onPress={this.props.toggleMenu}>
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

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    navContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 15,
      height: 45,
      backgroundColor: "#3f93c4"
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
