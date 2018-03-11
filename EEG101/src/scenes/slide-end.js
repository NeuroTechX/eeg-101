import React, { Component } from "react";
import {
  Text,
  View,
  ViewPagerAndroid,
  Image,
  ImageBackground,
  Linking,
  TouchableOpacity
} from "react-native";
import { MediaQueryStyleSheet } from "react-native-responsive";
import { connect } from "react-redux";
import WhiteButton from "../components/WhiteButton";
import LinkButton from "../components/WhiteLinkButton";
import I18n from "../i18n/i18n";
import * as colors from "../styles/colors";

function mapStateToProps(state) {
  return {
    isOfflineMode: state.isOfflineMode
  };
}

class End extends Component {
  constructor(props) {
    super(props);
  }

  renderButtons() {
    if (this.props.isOfflineMode) {
      return (
        <View style={styles.buttonBox}>
          <LinkButton path={"/offline/slideOne"}>
            {I18n.t("restartButton")}
          </LinkButton>
        </View>
      );
    }
    return (
      <View style={styles.buttonBox}>
        <LinkButton path={"/sandbox"}>{I18n.t("sandboxButton")}</LinkButton>
        <LinkButton path={"/bciTrain"}>{I18n.t("bciButton")}</LinkButton>
      </View>
    );
  }

  render() {
    return (
      <ImageBackground
        source={require("../assets/clouds.png")}
        style={styles.container}
        resizeMode="stretch"
      >
        <ViewPagerAndroid //Allows us to swipe between blocks
          initialPage={0}
          style={styles.viewPager}
        >
          <View style={styles.page}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>{I18n.t("thanksForCompleting")}</Text>
              <Text style={styles.body}>{I18n.t("hopeYouEnjoyed")}</Text>
            </View>

            <View style={styles.listBox}>
              <Text style={styles.header}>{I18n.t("furtherLearning")}</Text>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    "https://medium.com/neurotechx/a-techys-introduction-to-neuroscience-3f492df4d3bf"
                  );
                }}
              >
                <Text style={styles.link}>{I18n.t("techysIntroduction")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("https://github.com/NeuroTechX/awesome-bci");
                }}
              >
                <Text style={styles.link}>{I18n.t("bciResource")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    "https://ocw.mit.edu/resources/res-6-007-signals-and-systems-spring-2011/index.htm"
                  );
                }}
              >
                <Text style={styles.link}>
                  {I18n.t("signalProcessingResource")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    "https://medium.com/@ageitgey/machine-learning-is-fun-80ea3ec3c471"
                  );
                }}
              >
                <Text style={styles.link}>
                  {I18n.t("machineLearningResource")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/swipeiconwhite.png")}
                resizeMode="contain"
                style={styles.swipeImage}
              />
            </View>
          </View>

          <View style={styles.page}>
            <View style={styles.titleBox}>
              <Text style={styles.header}>{I18n.t("projectOpenSource")}</Text>
              <Text style={styles.body}>{I18n.t("resultOfCollaboration")}</Text>
              <View style={styles.textBox}>
                <Text style={styles.body}>{I18n.t("interestedInApp")}</Text>
              </View>
            </View>

            <View style={styles.logoBox}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("http://neurotechx.com/");
                }}
              >
                <Image
                  source={require("../assets/ntx.png")}
                  resizeMode="contain"
                  style={styles.logo}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("http://www.kbdgroup.ca/index.html");
                }}
              >
                <Image
                  source={require("../assets/kbdlogo.png")}
                  resizeMode="contain"
                  style={styles.logo}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("https://github.com/NeuroTechX/eeg-101");
                }}
              >
                <Image
                  source={require("../assets/gitlogo.png")}
                  resizeMode="contain"
                  style={styles.logo}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("https://neurotechx.herokuapp.com/");
                }}
              >
                <Image
                  source={require("../assets/slacklogowhite.png")}
                  resizeMode="contain"
                  style={styles.logo}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.marginContainer}>
              <Image
                source={require("../assets/swipeiconwhite.png")}
                resizeMode="contain"
                style={styles.swipeImage}
              />
            </View>
          </View>

          <View style={styles.page}>
            <View style={styles.titleBox}>
              <Text style={styles.header}>{I18n.t("haveFeedback")}</Text>
              <View style={styles.textBox}>
                <Text style={styles.body}>
                {I18n.t("suggestions")}
                </Text>
              </View>
              <View style={styles.textBox}>
                <Text style={styles.body}>
                {I18n.t("bugs")}
                </Text>
              </View>
            </View>
            <View style={styles.feedbackBox}>
              <WhiteButton
                onPress={() =>
                  Linking.openURL("https://goo.gl/forms/IokX3zq6Fqskuscv2")
                }
              >
              {I18n.t("feedbackButton")}
              </WhiteButton>
            </View>
            <View style={styles.marginContainer}>
              <Image
                source={require("../assets/swipeiconwhite.png")}
                resizeMode="contain"
                style={styles.swipeImage}
              />
            </View>
          </View>

          <View style={styles.page}>
            <View style={styles.listBox}>
              <Text style={styles.header}>{I18n.t("theTeam")}</Text>
              <Text style={styles.body}>Hubert Banville - Visionary</Text>
              <Text style={styles.body}>Dano Morrison - Developer</Text>
              <Text style={styles.body}>Tom McNeely - Developer</Text>
              <Text style={styles.body}>Geordan King - Producer</Text>
              <Text style={styles.body}>Michael Vu - Author</Text>
              <Text style={styles.body}>Joanna Jang - Author</Text>
              <Text style={styles.body}>Brian Stern - Software Architect</Text>
              <Text style={styles.body}>Steve Harjula - Visual Design</Text>
              <Text style={styles.body}>Miles McCraw - Animator</Text>
            </View>

            {this.renderButtons()}
          </View>
        </ViewPagerAndroid>
      </ImageBackground>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    body: {
      fontFamily: "Roboto-Light",
      fontSize: 17,
      color: colors.white,
      textAlign: "center",
      paddingLeft: 15,
      paddingRight: 15
    },

    container: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch",
      width: null,
      height: null,
      backgroundColor: "rgba(0,0,0,0)"
    },

    viewPager: { flex: 8 },

    header: {
      fontFamily: "Roboto-Bold",
      color: colors.white,
      fontSize: 20,
      margin: 15
    },

    textBox: {
      margin: 20,
      justifyContent: "space-around",
      alignItems: "center"
    },

    listBox: {
      flex: 3,
      margin: 20,
      justifyContent: "space-around",
      alignItems: "center"
    },

    logoBox: {
      borderRadius: 20,
      marginTop: -20,
      marginBottom: 40,
      opacity: 1,
      flex: 0.75,
      backgroundColor: "black",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around"
    },

    feedbackBox: {
      margin: 20,
      marginTop: -20,
      flex: 0.75,
      alignItems: 'stretch',
      alignSelf: 'stretch',
    },

    logo: {
      width: 60,
      height: 40
    },

    imageContainer: {
      marginBottom: 20
    },

    title: {
      textAlign: "center",
      marginTop: 15,
      marginBottom: 15,
      lineHeight: 50,
      color: colors.white,
      fontFamily: "Roboto-Black",
      fontSize: 30
    },

    link: {
      color: colors.white,
      fontFamily: "Roboto-Light",
      textDecorationLine: "underline"
    },

    titleBox: {
      flex: 4,
      alignItems: "center",
      justifyContent: "center"
    },

    swipeImage: {
      height: 40,
      width: 40
    },

    page: {
      flex: 1,
      alignItems: "center",
      marginBottom: 15
    },

    buttonBox: {
      alignSelf: "stretch",
      alignItems: "stretch",
      margin: 20
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      header: {
        fontSize: 30
      },

      body: {
        paddingLeft: 50,
        paddingRight: 50,
        fontSize: 20
      },

      swipeImage: {
        margin: 50,
        height: 75,
        width: 75
      },

      logo: {
        width: 120,
        height: 90
      },

      buttonBox: {
        padding: 20
      }
    }
  }
);

export default connect(mapStateToProps)(End);
