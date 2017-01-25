import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  Image
} from 'react-native';
import{
  Actions,
}from 'react-native-router-flux';
import { connect } from 'react-redux';

//Interfaces. For advanced elements such as graphs
import WaveGraphView from '../interface/WaveGraphView';

import Button from '../components/Button';
import PopUpList from '../components/PopUpList';
import ListItemBlock from '../components/ListItemBlock';
import PopUpLink from '../components/PopUpLink';
import ElectrodeSelector from '../components/ElectrodeSelector';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
  return {
    isVisible: state.scene.sceneKey === 'SlideNine',
    dimensions: state.graphviewDimensions,
  };
}

class SlideNine extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      channelOfInterest: 1,
      popUp1Visible: false,
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <WaveGraphView dimensions ={this.props.dimensions} visibility={this.props.isVisible} channelOfInterest={this.state.channelOfInterest}/>

        <Text style={styles.currentTitle}>WAVES</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>What do these frequencies represent?</Text>
            <Text style={styles.body}>The relative strengths of these <PopUpLink onPress={() => this.setState({popUp1Visible: true})}>brain waves</PopUpLink> can give us clues as to what patterns of brain activity are present
            </Text>
            <Button onPress={Actions.End}>Next</Button>
          </View>

          <View style ={styles.pageStyle}>
            <ElectrodeSelector channelOfInterest={(channel) => this.setState({channelOfInterest: channel})}/>
          </View>

        </ViewPagerAndroid>

        <PopUpList onClose={() => this.setState({popUp1Visible: false})} visible={this.state.popUp1Visible}>
          <ListItemBlock title = "Delta (0-4 Hz)">
            Delta waves are the slowest (ie. lowest frequency) brain waves. Delta waves dominate during deep sleep tend to be high in amplitude because they represent the synchronized firing of large populations of neurons.
          </ListItemBlock>
          <ListItemBlock title = "Theta (4-8 Hz)">
            Theta waves are most commonly observed in the period just before falling asleep and have been suggested to be related to increased creativity that can occur during this 'hypnagogic' state. They have also been observed during deep meditative and hypnotic states.
          </ListItemBlock>
          <ListItemBlock title = "Alpha (8-13 Hz)">
            Alpha waves are most prevalent when the brain is awake but relaxed, leading some researchers to think they arise from the awake but quiet and controlled activity of neurons at rest. For example, the dramatica increase in alpha waves observed when the eyes are closed is strongest at the back, where visual processing occurs and where neural activity would be expected to quiet down.
          </ListItemBlock>
          <ListItemBlock title = "Beta (13-30 Hz)">
            Beta waves are prevalent when the brain is awake and active. They have been associated with alertness, concentration, and the active, sometimes chaotic, firing of neurons hard at work.
          </ListItemBlock>
          <ListItemBlock title = "Gamma (30-100 Hz)">
            Gamma waves are the fastest form of neural oscillation. They are difficult to detect and analyze with ordinary EEG but are a topic of much ongoing research. They have been tentatively associated with attention, working memory, and even consciousness
          </ListItemBlock>
        </PopUpList>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  currentTitle: {
    marginLeft: 20,
    marginTop: 10,
    fontSize: 13,
    fontFamily: 'Roboto-Medium',
    color: '#6CCBEF',
  },

  body: {
    fontFamily: 'Roboto-Light',
    color: '#484848',
    fontSize: 19,
  },

  container: {
    marginTop:55,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },

  graphContainer: {
    backgroundColor: 'white',
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

  pageStyle: {
    padding: 20,
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },

  image: {
    flex: 1,
    width: null,
    height: null,
  },

});

export default connect(mapStateToProps)(SlideNine);