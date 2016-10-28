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
import GraphView from '../interface/GraphView';

import Button from '../components/Button';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';
import ElectrodeSelector from '../components/ElectrodeSelector';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {
      isVisible: state.scene.sceneKey === 'SlideThree',
      connectionStatus: state.connectionStatus,
    };
  }

class SlideFour extends Component {
  constructor(props) {
    super(props);
    isVisible: true;

      // Initialize States
    this.state = {
      channelOfInterest: 1,
      popUp1Visible: false,
      popUp2Visible: false,
      popUp3Visible: false,
    }
  }

  render() {
    return (
      <View style={styles.container}>
      
        <View style={styles.graphContainer}>
          <GraphView style={{flex:1}} visibility={this.props.isVisible} 
          channelOfInterest={this.state.channelOfInterest}/>
        </View>
        <ElectrodeSelector
          channelOfInterest={(channel) => this.setState({channelOfInterest: channel})}/>

        <Text style={styles.currentTitle}>HARDWARE</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>How does an EEG device work?</Text>
            <Text style={styles.body}>The electrical activity of the brain is sensed by <PopUpLink onPress={() => this.setState({popUp1Visible: true})}>electrodes</PopUpLink> placed on the scalp.</Text>
          </View>
          
          <View style={styles.pageStyle}>
            <Text style={styles.header}>Most EEG devices contain multiple electrodes</Text>
            <Text style={styles.body}>The device you are wearing has <PopUpLink onPress={() => this.setState({popUp2Visible: true})}>4 seperate electrodes.</PopUpLink> Touch the head diagram above to view the signal at each of the electrodes.
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>What do electrodes measure?</Text>
            <Text style={styles.body}>Each electrode's reading is compared to a <PopUpLink onPress={() => this.setState({popUp3Visible: true})}>reference sensor</PopUpLink> and then amplified around 1,000,000 times.</Text>
            <Button onPress={Actions.End}>NEXT MODULE</Button>
          </View>
        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUp1Visible: false})} visible={this.state.popUp1Visible}
        title='Electrodes'>
          An electrode is a conductor through which electricity flows. The device you are wearing (Muse) uses dry electrodes that don't require conductive gel and can be placed directly on the skin.
        </PopUp>

        <PopUp onClose={() => this.setState({popUp2Visible: false})} visible={this.state.popUp2Visible}
        title='Electrode naming conventions' image={require('../assets/electrodelocations.png')}>
      
          EEG electrodes are typically identified by a combination of a letter and a number. The letter indicates the part of the head where the electrode is located (F for frontal, C for central, etc.). EEG electrodes are typically identified by a combination of a letter and a number. The letter indicates the part of the head where the electrode is located (F for frontal, C for central, etc.).        
        </PopUp>

        <PopUp onClose={() => this.setState({popUp3Visible: false})} visible={this.state.popUp3Visible}
        title='Referencing'>
          Each electrode's signal is actually the relative difference in electrical potential between that electrode and the reference. Thus, the placement of the reference electrode is very import. In the Muse, the reference is located on the front of the forehead (indicated in black).
        </PopUp>

        <PopUp onClose={Actions.ConnectorOne} visible={(this.props.isVisible && this.props.connectionStatus === config.connectionStatus.DISCONNECTED)} title='Muse Disconnected'>
        Please reconnect to continue the tutorial</PopUp>
        
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