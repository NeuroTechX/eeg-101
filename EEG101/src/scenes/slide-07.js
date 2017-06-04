import React, { Component } from "react";
import { StyleSheet, Text, View, ViewPagerAndroid, Image } from "react-native";
import Animation from "lottie-react-native";
import { connect } from "react-redux";
import LinkButton from "../components/LinkButton";
import PopUp from "../components/PopUp";
import PopUpLink from "../components/PopUpLink";
import { MediaQueryStyleSheet } from "react-native-responsive";

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function mapStateToProps(state) {
  return {
    dimensions: state.graphViewDimensions
  };
}

class SlideSeven extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUp1Visible: false,
      popUp2Visible: false,
      popUp3Visible: false
    };
  }

  componentDidMount() {
    this.animation.play();
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.graphContainer}>
          <Animation
            ref={animation => {
              this.animation = animation;
            }}
            style={{
              height: this.props.dimensions.height,
              width: this.props.dimensions.width
            }}
            source="fourier.json"
            loop={true}
          />
        </View>

        <Text style={styles.currentTitle}>FEATURE EXTRACTION</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}
        >

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Breaking down the EEG</Text>
            <Text style={styles.body}>
              Once noise is removed, the EEG can be broken down into many
              simpler periodic signals or
              {" "}<PopUpLink
                onPress={() => this.setState({ popUp1Visible: true })}
              >
                waves.
              </PopUpLink>
            </Text>

          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>How is the EEG broken down?</Text>
            <Text style={styles.body}>
              Complex signals can be broken down into simpler signals with a
              mathematical function known as the
              {" "}<PopUpLink
                onPress={() => this.setState({ popUp2Visible: true })}
              >
                Fourier Transform.
              </PopUpLink>
            </Text>
            <LinkButton path="/slideEight"> NEXT </LinkButton>
          </View>

        </ViewPagerAndroid>

        <PopUp
          onClose={() => this.setState({ popUp1Visible: false })}
          visible={this.state.popUp1Visible}
          title="Waves"
        >
          Each wave is characterised by a certain frequency (number of cycles
          per second, Hertz (Hz)). A high frequency wave has many cycles per
          second, whereas a low frequency wave has fewer cycles per second.
          Waves of different frequencies are associated with different patterns
          of neural firing.
        </PopUp>

        <PopUp
          onClose={() => this.setState({ popUp2Visible: false })}
          visible={this.state.popUp2Visible}
          title="Fourier transform"
        >
          The Fourier Transform decomposes a complex signal into a collection of
          simple sine waves. Often, we use an algorithm specifically called the
          Fast Fourier Transform (FFT) to perform this decomposition in EEG.
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
      backgroundColor: "white",
      flex: 4,
      justifyContent: "center",
      alignItems: "stretch"
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

export default connect(mapStateToProps)(SlideSeven);
