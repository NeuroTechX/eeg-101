// LineNoisePicker.js
// A picker that allows the user to select 50 or 60hz line noise filtering absed on their location

import React, { Component } from "react";
import { Text, View, Picker } from "react-native";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { setNotchFrequency } from "../redux/actions";
import { bindActionCreators } from "redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import I18n from "../i18n/i18n";

import * as colors from "../styles/colors";

function mapStateToProps(state) {
  return {
    notchFrequency: state.notchFrequency
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setNotchFrequency
    },
    dispatch
  );
}

class LineNoisePicker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text style={styles.title}>{I18n.t('notchFrequency')}</Text>
        <View style={styles.padding}>
        <Picker style={styles.picker}
          selectedValue={this.props.notchFrequency}
          onValueChange={(itemValue) =>
            this.props.setNotchFrequency(itemValue)}
        >
          <Picker.Item label="60hz (NA)" value={60} />
          <Picker.Item label="50hz (EU)" value={50} />
        </Picker>
      </View>
      </View>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LineNoisePicker)
);

const styles = MediaQueryStyleSheet.create(
  {
    // Base styles
    title: {
      paddingLeft: 16,
      fontFamily: "Roboto-Bold",
      color: colors.white,
      fontSize: 18
    },

    padding: {
      paddingLeft: 16,
    },

    section: {
      flex: 1,
      marginTop: 8,
      justifyContent: "flex-start"
    },

    picker: {
      color: colors.white
    }
  },
  // Responsive styles
  {}
);
