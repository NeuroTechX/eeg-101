import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import{
  Actions,
}from 'react-native-router-flux';
import { connect } from 'react-redux';
import config from '../redux/config';
import { bindActionCreators } from 'redux';
import { setGraphViewDimensions } from '../redux/actions';
import Button from '../components/Button';
import SandboxButton from '../components/SandboxButton';
import { MediaQueryStyleSheet }  from 'react-native-responsive';
import SandboxGraph from '../components/SandboxGraph';
import ElectrodeSelector from '../components/ElectrodeSelector';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
  return {
    isVisible: state.scene.sceneKey === 'Sandbox',
    connectionStatus: state.connectionStatus,
    dimensions: state.graphViewDimensions,
  };
}

// Binds actions to component's props
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setGraphViewDimensions,
  }, dispatch);
}

class Sandbox extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      graphType: config.graphType.EEG,
      channelOfInterest: 1,
      isRecording: false,
    };
  }

  render() {

    switch (this.state.graphType) {
      case config.graphType.EEG:
        infoString = 'Single-channel EEG displays raw, unprocessed data from one electrode';
        break;

      case config.graphType.FILTER:
        infoString = 'Low-pass filtering removes high frequency noise';
        break;

      case config.graphType.WAVES:
        infoString ='The PSD curve represents the strength of different frequencies in the EEG';
        break;
    }

    return (
      <View style={styles.container}>
        <View style={styles.graphContainer} onLayout={(event) => {
          // Captures the width and height of the graphContainer to determine overlay positioning properties in PSDGraph
          let {x, y, width, height} = event.nativeEvent.layout;
          this.props.setGraphViewDimensions({x: x, y: y, width: width, height: height})
        }}>
          <SandboxGraph style={{flex:1}}
                        visibility={this.props.isVisible}
                        channelOfInterest={this.state.channelOfInterest}
                        graphType={this.state.graphType}
                        dimensions={this.props.dimensions}
                        isRecording={this.state.isRecording}
          />
        </View>

        <Text style={styles.currentTitle}>SANDBOX</Text>

        <View style={styles.pageContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.buttonContainer}>
              <SandboxButton onPress={() => this.setState({graphType: config.graphType.EEG})}
                             active={this.state.graphType === config.graphType.EEG}>Raw</SandboxButton>
              <SandboxButton onPress={() => this.setState({graphType: config.graphType.FILTER})}
                             active={this.state.graphType === config.graphType.FILTER}>Filtered</SandboxButton>
              <SandboxButton onPress={() => this.setState({graphType: config.graphType.WAVES})}
                             active={this.state.graphType === config.graphType.WAVES}>PSD</SandboxButton>
              <SandboxButton onPress={() => {
                console.log('isRecording state flipped');
                this.setState({isRecording: !this.state.isRecording})}}>Start/Stop Recording</SandboxButton>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.body}>
              {infoString}
              </Text>
            </View>

            <ElectrodeSelector channelOfInterest={(channel) => this.setState({channelOfInterest: channel})}/>

          </View>

          <Button onPress={Actions.End}>END</Button>
        </View>
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
      justifyContent: 'space-around',
      alignItems: 'stretch',
    },

    graphContainer: {
      flex: 5,
      justifyContent: 'center',
      alignItems: 'stretch',
    },

    currentTitle: {
      marginLeft: 20,
      marginTop: 10,
      fontSize: 13,
      fontFamily: 'Roboto-Medium',
      color: '#6CCBEF',
    },

    buttonContainer: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },

    body: {
      padding: 5,
      fontFamily: 'Roboto-Light',
      color: '#484848',
      fontSize: 17,
    },

    pageContainer: {
      flex: 4,
      marginTop: -15,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 15,
    },

    infoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    textContainer: {
      flex: 2,
    },

  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      currentTitle: {
        fontSize: 20,
      },

      body: {
        fontSize: 25,
      }
    }
  });