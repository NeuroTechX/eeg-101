import React, { Component } from "react";
import { StyleSheet, Text, View, ViewPagerAndroid, Image } from "react-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import I18n from "../i18n/i18n";
import LinkButton from "../components/LinkButton";
import PopUp from "../components/PopUp";
import PopUpList from "../components/PopUpList.js";
import ListItemBlock from "../components/ListItemBlock.js";
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
      popUp1Visible: false,
      popUp2Visible: false
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
              A BCI is a communication channel that allows the brain to{" "}
              <PopUpLink onPress={() => this.setState({ popUp1Visible: true })}>
                interact
              </PopUpLink>{" "}
              with an external device such as a computer
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>
              How can we use EEG to make a BCI?
            </Text>
            <Text style={styles.body}>
              We can teach a computer to execute a command when it recognizes a certain pattern of brain activity. This process is called {" "}
              <PopUpLink onPress={() => this.setState({ popUp2Visible: true })}>
                machine learning
              </PopUpLink>
            </Text>
            <LinkButton path="/bciTwo"> LET'S BUILD A BCI </LinkButton>
          </View>

        </ViewPagerAndroid>

        <PopUpList
          title='Types of BCI interaction'
          onClose={() => this.setState({ popUp1Visible: false })}
          visible={this.state.popUp1Visible}
        >
          <ListItemBlock title='Active'>
            Active BCI involves the user generating brain signals actively in
            order to control a computer. For example, using imagined movement of
            either the right or left hand to steer an avatar right or left. The
            function of active BCIs are to replace conventional interfaces such
            as keys on a keyboard.
          </ListItemBlock>
          <ListItemBlock title='Reactive'>
            Reactive BCIs use the brain's natural response to stimuli in order
            to gauge the user's intent. Although they don't require direct and
            conscious control, reactive BCIs must be built around specific
            stimuli that evolve known brain responses when perceived.
          </ListItemBlock>
          <ListItemBlock title='Passive'>
            Passive BCIs monitor the user's mental states without any effort
            their part. For example, passive BCIs might monitor attention,
            relaxation, or emotional state and use that information to adjust
            elements of a game.
          </ListItemBlock>
        </PopUpList>

        <PopUp
          onClose={() => this.setState({ popUp2Visible: false })}
          visible={this.state.popUp2Visible}
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
