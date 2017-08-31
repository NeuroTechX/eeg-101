import React, { Component } from "react";
import { StyleSheet, Text, View, ViewPagerAndroid, Image } from "react-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import LinkButton from "../components/LinkButton";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";

class SceneTemplate extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUp1Visible: false
    };
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.graphContainer}>
          <Text>Place visual component here. Probably GraphView, Image, or Lottie animation </Text>
        </View>

        <Text style={styles.currentTitle}>TITLE</Text>

        <ViewPagerAndroid
          style={styles.viewPager}
          initialPage={0}
        >

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Header</Text>
            <Text style={styles.body}>
              Some lesson text that explains something.
              {" "}
              <PopUpLink onPress={() => this.setState({ popUpVisible: true })}>
                This is a pop up link.
              </PopUpLink>
              {" "}
            </Text>
            <LinkButton path="/begin-landing"> NEXT </LinkButton>
          </View>

        </ViewPagerAndroid>

        <PopUp
          onClose={() => this.setState({ popUpVisible: false })}
          visible={this.state.popUpVisible}
          image={require("../assets/hansberger.jpg")}
          title="Pop up title"
        >
          Some more advanced lesson text that goes more into depth.
        </PopUp>

      </View>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    currentTitle: {
      marginLeft: 20,
      marginTop: 10,
      fontSize: 13,
      fontFamily: "Roboto-Medium",
      color: colors.skyBlue
    },

    body: {
      fontFamily: "Roboto-Light",
      color: colors.black,
      fontSize: 19
    },

    container: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch"
    },

    graphContainer: {
      backgroundColor: colors.skyBlue,
      flex: 4,
      justifyContent: "center",
      alignItems: "stretch"
    },

    header: {
      fontFamily: "Roboto-Bold",
      color: colors.black,
      fontSize: 20
    },

    viewPager: {
      flex: 4
    },

    pageStyle: {
      padding: 20,
      alignItems: "stretch",
      justifyContent: "space-around"
    },

    image: {
      flex: 1,
      width: null,
      height: null
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      viewPager: {
        flex: 3
      },

      header: {
        fontSize: 30
      },

      currentTitle: {
        fontSize: 20
      },

      body: {
        fontSize: 25
      }
    }
  }
);
export default connect(SceneTemplate);
