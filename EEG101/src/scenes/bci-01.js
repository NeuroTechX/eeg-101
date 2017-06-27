import React, { Component } from "react";
import { StyleSheet, Text, View, ViewPagerAndroid, Image } from "react-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import LinkButton from "../components/LinkButton";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";

function mapStateToProps(state) {
  return {
    dimensions: state.graphViewDimensions
  };
}

class BCIOne extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUpVisible: false
    };
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.graphContainer}>
          <Image
            source={require("../assets/bci_diagram.png")}
            style={styles.image}
            resizeMode={"contain"}
          />
        </View>
        <Text style={styles.currentTitle}>BRAIN-COMPUTER INTERFACES</Text>

        <ViewPagerAndroid style={styles.viewPager} initialPage={0}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              What is a Brain-Computer Interface?
            </Text>
            <Text style={styles.body}>
              A BCI is a communication channel that allows the brain to interact
              with an external device such as a computer
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              How can we use EEG to make a BCI?
            </Text>
            <Text style={styles.body}>
              We can teach a simple program to execute a command when your brain waves match a pattern. This program is called a {" "}
              <PopUpLink onPress={() => this.setState({ popUpVisible: true })}>
                machine learning algorithm
              </PopUpLink>
            </Text>
            <LinkButton path="/bciTwo"> NEXT </LinkButton>
          </View>

        </ViewPagerAndroid>

        <PopUp
          onClose={() => this.setState({ popUpVisible: false })}
          visible={this.state.popUpVisible}
          title="Machine Learning"
        >
          A machine learning algorithm is a computer program that learns by
          looking at examples. For instance, machine learning algorithms can
          learn to recognize objects in a picture by looking at thousands of
          pictures of different objects. In an EEG BCI, this type of algorithm
          looks at many instances of someone’s brain activity and finds an
          optimal way to recognize what the user is doing.
        </PopUp>

      </View>
    );
  }
}

export default connect(mapStateToProps)(BCIOne);

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    currentTitle: {
      marginLeft: 20,
      marginTop: 10,
      fontSize: 13,
      fontFamily: "Roboto-Medium",
      color: "#6CCBEF"
    },

    body: {
      fontFamily: "Roboto-Light",
      color: "#484848",
      fontSize: 19
    },

    container: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch"
    },

    graphContainer: {
      backgroundColor: "#72c2f1",
      flex: 4,
      justifyContent: "center",
      alignItems: "stretch"
    },

    image: {
      flex: 1,
      width: null,
      height: null
    },

    header: {
      fontFamily: "Roboto-Bold",
      color: "#484848",
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
