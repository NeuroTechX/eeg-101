// SideMenu.js
// A sliding side menu for displaying settings and connect links
// Based on react-native-side-menu

import React, { Component } from "react";
import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
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

class SideMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.menuContainer}>
        <Text style={styles.menuText}>Account Settings</Text>
        <Text style={styles.menuText}>Tavern Connect</Text>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);

const styles = StyleSheet.create({
  menuContainer: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#3f93c4"
  },

  menuText: {
    margin: 10,
    fontSize: 20,
  }
});
