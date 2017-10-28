import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import config from "../redux/config";
import { bindActionCreators } from "redux";
import { setGraphViewDimensions } from "../redux/actions";
import PopUp from "../components/PopUp";
import LinkButton from "../components/LinkButton";
import RecorderButton from "../components/RecorderButton";
import SandboxButton from "../components/SandboxButton";
import { MediaQueryStyleSheet } from "react-native-responsive";
import SandboxGraph from "../components/SandboxGraph";
import ElectrodeSelector from "../components/ElectrodeSelector";
import * as colors from "../styles/colors";

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
    dimensions: state.graphViewDimensions,
    notchFrequency: state.notchFrequency
  };
}

// Binds actions to component's props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setGraphViewDimensions
    },
    dispatch
  );
}

class Sandbox extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      graphType: config.graphType.EEG,
      channelOfInterest: 1,
      isRecording: false,
      filterType: config.filterType.LOWPASS
    };
  }

  renderInfoView() {
    let text = "";
    switch (this.state.graphType) {
      case config.graphType.EEG:
        return (
          <Text style={styles.body}>
            Single-channel EEG displays raw, unprocessed data from one electrode
          </Text>
        );

      case config.graphType.FILTER:
        switch (this.state.filterType) {
          case config.filterType.LOWPASS:
            text = "< 35hz low-pass";
            break;
          case config.filterType.HIGHPASS:
            text = "> 2hz high-pass";
            break;
          case config.filterType.BANDPASS:
            text = "2-35hz band-pass";
            break;
        }
        return (
          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>
              {text}
            </Text>
            <View style={styles.filterButtonContainer}>
              <SandboxButton
                onPress={() =>
                  this.setState({
                    filterType: config.filterType.LOWPASS,
                    isRecording: false
                  })}
                active={this.state.filterType === config.filterType.LOWPASS}
              >
                LOW
              </SandboxButton>
              <SandboxButton
                onPress={() =>
                  this.setState({
                    filterType: config.filterType.HIGHPASS,
                    isRecording: false
                  })}
                active={this.state.filterType === config.filterType.HIGHPASS}
              >
                HIGH
              </SandboxButton>
              <SandboxButton
                onPress={() =>
                  this.setState({
                    filterType: config.filterType.BANDPASS,
                    isRecording: false
                  })}
                active={this.state.filterType === config.filterType.BANDPASS}
              >
                BAND
              </SandboxButton>
            </View>
          </View>
        );

      case config.graphType.WAVES:
        return (
          <Text style={styles.body}>
            The PSD curve represents the strength of different frequencies in
            the EEG
          </Text>
        );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={styles.graphContainer}
          onLayout={event => {
            // Captures the width and height of the graphContainer to determine overlay positioning properties in PSDGraph
            let { x, y, width, height } = event.nativeEvent.layout;
            this.props.setGraphViewDimensions({
              x: x,
              y: y,
              width: width,
              height: height
            });
          }}
        >
          <SandboxGraph
            style={styles.graphView}
            channelOfInterest={this.state.channelOfInterest}
            graphType={this.state.graphType}
            dimensions={this.props.dimensions}
            isRecording={this.state.isRecording}
            filterType={this.state.filterType}
            notchFrequency={this.props.notchFrequency}
          />
        </View>

        <Text style={styles.currentTitle}>SANDBOX</Text>

        <View style={styles.pageContainer}>
          <View style={styles.rowContainer}>
            <View style={styles.infoContainer}>
              <View style={styles.buttonContainer}>
                <SandboxButton
                  onPress={() =>
                    this.setState({
                      graphType: config.graphType.EEG,
                      isRecording: false
                    })}
                  active={this.state.graphType === config.graphType.EEG}
                >
                  RAW
                </SandboxButton>
                <SandboxButton
                  onPress={() =>
                    this.setState({
                      graphType: config.graphType.FILTER,
                      isRecording: false
                    })}
                  active={this.state.graphType === config.graphType.FILTER}
                >
                  FILTERED
                </SandboxButton>
                <SandboxButton
                  onPress={() =>
                    this.setState({
                      graphType: config.graphType.WAVES,
                      isRecording: false
                    })}
                  active={this.state.graphType === config.graphType.WAVES}
                >
                  PSD
                </SandboxButton>
                <RecorderButton
                  isRecording={this.state.isRecording}
                  onPress={() => {
                    this.setState({ isRecording: !this.state.isRecording });
                  }}
                />
              </View>

              <View style={styles.textContainer}>
                {this.renderInfoView()}
              </View>
            </View>
            <ElectrodeSelector
              style={styles.electrodeSelector}
              channelOfInterest={channel =>
                this.setState({ channelOfInterest: channel })}
            />
          </View>

          <LinkButton path="/end">END</LinkButton>
        </View>
        <PopUp
          onClose={() => this.props.history.push("/connectorOne")}
          visible={
            this.props.connectionStatus === config.connectionStatus.DISCONNECTED
          }
          title="Muse Disconnected"
        >
          Please reconnect to continue the tutorial
        </PopUp>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sandbox);

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    container: {
      backgroundColor: colors.white,
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch"
    },

    graphContainer: {
      flex: 5,
      justifyContent: "center",
      alignItems: "stretch"
    },

    graphView: { flex: 1 },

    electrodeSelector: {
      alignSelf: "center"
    },

    currentTitle: {
      marginLeft: 20,
      marginTop: 10,
      marginBottom: 10,
      fontSize: 13,
      fontFamily: "Roboto-Medium",
      color: colors.skyBlue
    },

    buttonContainer: {
      paddingTop: 10,
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between"
    },

    body: {
      padding: 5,
      fontFamily: "Roboto-Light",
      color: colors.black,
      fontSize: 17
    },

    filterContainer: {
      flex: 1,
      alignItems: "center"
    },

    filterButtonContainer: {
      flex: 1,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between"
    },

    filterText: {
      fontFamily: "Roboto-Light",
      color: colors.black,
      fontSize: 14
    },

    pageContainer: {
      flex: 4,
      marginTop: -15,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 15
    },

    rowContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },

    infoContainer: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between"
    },

    textContainer: {
      justifyContent: "center",
      flex: 2
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      currentTitle: {
        fontSize: 20
      },

      body: {
        fontSize: 25
      }
    }
  }
);
