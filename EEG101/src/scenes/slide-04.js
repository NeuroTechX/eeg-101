import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  Image,
} from 'react-native';
import{
  Actions,
}from 'react-native-router-flux';
import { connect } from 'react-redux';
import config from '../../config';



//Interfaces. For advanced elements such as graphs
import CircBufferGraphView from '../interface/CircBufferGraphView';

import Button from '../components/Button';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';
import ElectrodeSelector from '../components/ElectrodeSelector';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {
      isVisible: state.scene.sceneKey === 'SlideFour',
      connectionStatus: state.connectionStatus,
    };
  }

class SlideFour extends Component {
  constructor(props) {
    super(props);

      // Initialize States
    this.state = {
      popUpVisible: false,
    channelOfInterest: 1,
  };
}

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.graphContainer}>
          <CircBufferGraphView style={{flex:1}} visibility={this.props.isVisible} channelOfInterest={this.state.channelOfInterest}/>
        </View>

        <Text style={styles.currentTitle}>TEST</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
            style={styles.viewPager}
            initialPage={0}>

         

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Preparing the signal for analysis</Text>
            <Text style={styles.body}>This is a test of the Circular Buffer component of an upcoming analysis graph illustrating how to remove <PopUpLink onPress={() => this.setState({popUpVisible: true})}>noise</PopUpLink> from this signal.</Text>
            <Button onPress={Actions.SlideFive}>Next</Button>
          </View>

          <View style ={styles.pageStyle}>
            <ElectrodeSelector channelOfInterest={(channel) => this.setState({channelOfInterest: channel})}/>
          </View>
        </ViewPagerAndroid>

          

          <PopUp onClose={() => this.setState({popUpVisible: false})} visible={this.state.popUpVisible}>
          Electrodes conduct EEG signals from the brain, but also noise caused by eye movements and muscle activity. Electrical activity released by radio-emitting devices or the 50/60 Hz alternating (AC) current in electrical wiring can also be detected by EEG electrodes. 
          </PopUp>
      </View>
    );
  }
}

const styles = StyleSheet.create({

pageStyle: {
    padding: 20,
    alignItems: 'stretch',
    justifyContent: 'space-around',
 },

body: {
    fontFamily: 'Roboto-Light',
    color: '#484848',
    fontSize: 19,
  },

  currentTitle: {
    marginLeft: 20,
    marginTop: 10,
    fontSize: 13,
    fontFamily: 'Roboto-Medium',
    color: '#6CCBEF',
  },

  container: {
    marginTop:55,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
},

  graphContainer: {

    flex: 4,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  
  header: {
    fontFamily: 'Roboto-Bold',
    color: '#484848',
    fontSize: 20,
  },


  viewPager: {
    flex: 4,
  },

});

export default connect(mapStateToProps)(SlideFour);