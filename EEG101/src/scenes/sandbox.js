import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import{
  Actions,
}from 'react-native-router-flux';
import { connect } from 'react-redux';
import config from '../redux/config';
import { bindActionCreators } from 'redux';
import { setGraphViewDimensions } from '../redux/actions';
import Button from '../components/Button';
import { MediaQueryStyleSheet }  from 'react-native-responsive';

//Interfaces. For advanced elements such as graphs
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
      dimensions: {x: 0, y: 0, width: 0, height: 0},
      graphType: config.graphType.EEG,
      channelOfInterest: 1,
    };
  }

  render() {
    return (
      <View style={styles.container}>

        <SandboxGraph style={{flex:1}}
                      visibility={this.props.isVisible}
                      channelOfInterest={this.state.channelOfInterest}
                      graphType={this.state.graphType}
                      dimensions={{x: 0, y: 0, width: 360, height: 413}}
        />

        <View style={{flexDirection: 'row'}}>
          <ElectrodeSelector channelOfInterest={(channel) => this.setState({channelOfInterest: channel})}/>
          <Button onPress={() => this.setState({graphType: config.graphType.EEG})}>EEG</Button>
          <Button onPress={() => this.setState({graphType: config.graphType.FILTER})}>Filter</Button>
          <Button onPress={() => this.setState({graphType: config.graphType.PSD})}>PSD</Button>
          <Button onPress={() => this.setState({graphType: config.graphType.WAVE})}>Wave</Button>
        </View>

        <View style={styles.nextButtonContainer}>
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
      marginTop: 55,
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'stretch',
    },

    nextButtonContainer: {
      padding: 20,
      alignItems: 'stretch',
      justifyContent: 'space-around',
    }
  },
  // Responsive styles
  {

  });
