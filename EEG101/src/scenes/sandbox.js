import React, { Component } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import config from "../redux/config";
import { bindActionCreators } from "redux";
import { setGraphViewDimensions } from "../redux/actions";
import PopUp from "../components/PopUp";
import Button from "../components/Button";
import LinkButton from "../components/LinkButton";
import RecorderButton from "../components/RecorderButton";
import SandboxButton from "../components/SandboxButton";
import { MediaQueryStyleSheet } from "react-native-responsive";
import SandboxGraph from "../components/SandboxGraph";
import ElectrodeSelector from "../components/ElectrodeSelector";

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
    dimensions: state.graphViewDimensions
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
            text = "< 35hz";
            break;
          case config.filterType.HIGHPASS:
            text = "> 2hz";
            break;
          case config.filterType.BANDPASS:
            text = "2-35hz";
            break;
        }
        return (
          <View style={styles.filterButtonContainer}>
            <Text style={styles.filterText}>{text}</Text>
            <SandboxButton
              onPress={() =>
                this.setState({
                  filterType: config.filterType.LOWPASS,
                  isRecording: false
                })}
              active={this.state.filterType === config.filterType.LOWPASS}
            >
              Low-pass
            </SandboxButton>
            <SandboxButton
              onPress={() =>
                this.setState({
                  filterType: config.filterType.HIGHPASS,
                  isRecording: false
                })}
              active={this.state.filterType === config.filterType.HIGHPASS}
            >
              High-pass
            </SandboxButton>
            <SandboxButton
              onPress={() =>
                this.setState({
                  filterType: config.filterType.BANDPASS,
                  isRecording: false
                })}
              active={this.state.filterType === config.filterType.BANDPASS}
            >
              Band-pass
            </SandboxButton>
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
            style={{ flex: 1 }}
            channelOfInterest={this.state.channelOfInterest}
            graphType={this.state.graphType}
            dimensions={this.props.dimensions}
            isRecording={this.state.isRecording}
            filterType={this.state.filterType}
          />
        </View>

        <Text style={styles.currentTitle}>SANDBOX</Text>

        <View style={styles.pageContainer}>
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
                Raw
              </SandboxButton>
              <SandboxButton
                onPress={() =>
                  this.setState({
                    graphType: config.graphType.FILTER,
                    isRecording: false
                  })}
                active={this.state.graphType === config.graphType.FILTER}
              >
                Filtered
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

            <ElectrodeSelector
              style={{ alignSelf: "center" }}
              channelOfInterest={channel =>
                this.setState({ channelOfInterest: channel })}
            />

          </View>

          <LinkButton path="/end">
            END
          </LinkButton>
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
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch"
    },

    graphContainer: {
      flex: 5,
      justifyContent: "center",
      alignItems: "stretch"
    },

    currentTitle: {
      marginLeft: 20,
      marginTop: 10,
      marginBottom: 10,
      fontSize: 13,
      fontFamily: "Roboto-Medium",
      color: "#6CCBEF"
    },

    buttonContainer: {
      paddingTop: 10,
      flex: 1,
      alignItems: "flex-start",
      justifyContent: "space-between"
    },

    body: {
      padding: 5,
      fontFamily: "Roboto-Light",
      color: "#484848",
      fontSize: 17
    },

    filterButtonContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between"
    },

    filterText: {
      fontFamily: "Roboto-Light",
      color: "#484848",
      fontSize: 14
    },

    pageContainer: {
      flex: 4,
      marginTop: -15,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 15
    },

    infoContainer: {
      flex: 1,
      flexDirection: "row",
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
