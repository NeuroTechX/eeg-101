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
import { setConnectionStatus } from '../../actions';
import config from '../../config';


import Button from '../components/Button';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';

//Interfaces. For advanced elements such as graphs
import GraphView from '../interface/GraphView';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {
      isVisible: state.scene.sceneKey === 'SlideOne',
      connectionStatus: state.connectionStatus,
    };
  }


class SlideOne extends Component {
  constructor(props) {
    super(props);
    
    // Initialize States
    this.state = {
      popUp1Visible: false,
      popUp2Visible: false,
      popUp3Visible: false,
      popUp4Visible: false,
    };
  }
  
  render() {
    return (
      <View style={styles.container}>

        <View  style={styles.graphContainer}>
          <GraphView style={{flex:1}} visibility={this.props.isVisible}/>
        </View>

        <Text style={styles.currentTitle}>INTRODUCTION</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Your brain produces electricity</Text>
            <Text style={styles.body}>
              Using the <PopUpLink onPress={() => this.setState({popUp1Visible: true})}>EEG</PopUpLink> device that you are wearing, we can detect the electrical activity of your brain.
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Try blinking your eyes...</Text>
            <Text style={styles.body}>Does the signal change?{"\n"}
            Eye movements create <PopUpLink onPress={() => this.setState({popUp2Visible: true})}>noise</PopUpLink> in the EEG signal.
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Try thinking about a cat... </Text>
            <Text style={styles.body}>Does the signal change?</Text>
            <Text style={styles.body}>Although EEG can measure overall brain activity, it’s not capable of <PopUpLink onPress={() => this.setState({popUp3Visible: true})}>reading minds.</PopUpLink>
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Now try closing your eyes for 10 seconds</Text>
            <Text style={styles.body}>You may notice a change in your signal due to an increase in <PopUpLink onPress={() => this.setState({popUp4Visible: true})}>alpha waves.</PopUpLink>
            </Text>
            <Button onPress={Actions.SlideTwo}>NEXT MODULE</Button>
          </View>

        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUp1Visible: false})} visible={this.state.popUp1Visible}
        title='What exactly is EEG?' image={require('../assets/hansberger.jpg')}>
          Electroencephalography (EEG) is a technique that measures the electrical activity of the brain with sensors that record fluctuations in voltage at the surface of the skull. The first human electroencephalogram was recorded in 1924 by Hans Berger, a German psychiatrist whose interest in ‘psychic energy’ led him to experiment with the electrical fields of the brain
          </PopUp>

        <PopUp onClose={() => this.setState({popUp2Visible: false})} visible={this.state.popUp2Visible}
        title='Noise'>
          Movement of the eyes (which are electrically charged) and activation of muscles produce electrical activity. Blinking, swallowing, and clenching the jaw produce electrical signals that are larger than those originating in the brain. These movement-related signals often cover up the EEG and make it difficult to read. To accurately sense the activity of the brain, keep movements to a minimum.
        </PopUp>

        <PopUp onClose={() => this.setState({popUp3Visible: false})} visible={this.state.popUp3Visible}
        title='EEG cannot read minds'>
           As you will soon learn, the EEG signal is generated when tens of thousands of brain cells produce electricity in-sync. However, no obvious signals accompany most thoughts, such as thinking about a cat. Obvious EEG signals which accompany thoughts are very rare.
        </PopUp>
        
        <PopUp onClose={() => this.setState({popUp4Visible: false})} visible={this.state.popUp4Visible}
        title='Closed eye rhythms'>
          When the eyes are closed, there is often a large increase in rhythmic brain activity in the range of 8-13 cycles per second (Hz). Alpha waves were one of the first discoveries that Hans Berger made with EEG. However, you may not be able to see your alpha waves clearly right now because seeing obvious alpha waves depends upon the position of the EEG sensors. Do not feel bad if you cannot see it!
        </PopUp>

        <PopUp onClose={Actions.ConnectorTwo} visible={(this.props.isVisible && this.props.connectionStatus === config.connectionStatus.DISCONNECTED)} title='Muse Disconnected'>
        Please reconnect to continue the tutorial</PopUp>

      </View>
    );
  }
}

export default connect(mapStateToProps)(SlideOne);

// Darker: #72C2F1
// Light: #97D2FC
const styles = StyleSheet.create({

  pageStyle: {
    padding: 15,
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },

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
