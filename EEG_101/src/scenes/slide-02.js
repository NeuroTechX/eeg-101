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

//Interfaces. For advanced elements such as graphs
import GraphView from '../interface/GraphView';

import Button from '../components/Button';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {isVisible: state.scene.sceneKey === 'SlideTwo'};
  }

class SlideThree extends Component {
  constructor(props) {
    super(props);
    isVisible: true;

      // Initialize States
    this.state = {
      popUp1Visible: false,
      popUp2Visible: false,
      popUp3Visible: false,
      slidePosition: 0,
    }
  }

  render() {
    // Sets the source of the lesson image based on the position of the ViewPager
    const imageSource = ((slidePosition) => {switch(slidePosition) {
      case 0:
        return require('../assets/neuronarrow.png');
        break;
      case 1:
        return require('../assets/neuronmultiarrow.png');
        break;
      case 2:
        return require('../assets/neuronsandelectrodes.png');
        break;
    }});
    return (
      <View style={styles.container}>
      
        <View style={styles.graphContainer}>
          <Image source={imageSource(this.state.slidePosition)}
                style={styles.image}
                resizeMode='contain'/>
        </View>

        <Text style={styles.currentTitle}>PHYSIOLOGY</Text>

        <ViewPagerAndroid // Allows us to swipe between child views
          style={styles.viewPager}
          initialPage={0}
          // Receives a native callback event e that is used to set slidePosition state
          onPageSelected={(e) => this.setState({slidePosition: e.nativeEvent.position})}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Where does the EEG signal come from?</Text>
            <Text style={styles.body}>The EEG measures the electrical activity that occurs when
             <PopUpLink onPress={() => this.setState({popUp1Visible: true})}> neurons </PopUpLink>
             receive and transmit information.
            </Text>
          </View>
          
          <View style={styles.pageStyle}>
          <Text style={styles.header}>Organized neural activity produces electric fields</Text>
            <Text style={styles.body}>When billions of neurons work together to produce thoughts, feelings, and behaviours, their activity can be 
             <PopUpLink onPress={() => this.setState({popUp2Visible: true})}> detected.</PopUpLink>
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>EEG detects the "state" of the brain</Text>
            <Text style={styles.body}>The nature of this organized activity can reveal aspects of brain function, such as
            <PopUpLink onPress={() => this.setState({popUp3Visible: true})}> sleep and alertness.</PopUpLink>
            </Text>
            <Button onPress={Actions.SlideThree}>Next</Button>
          </View>
        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUp1Visible: false})} visible={this.state.popUp1Visible}>
          When synapse are activated on a neuron's dendrites, a small electric field (a dipole) is created along the body of the neuron due to the difference in charge between its axons and dendrites. This electric field only lasts for a few milliseconds.
        </PopUp>

        <PopUp onClose={() => this.setState({popUp2Visible: false})} visible={this.state.popUp2Visible}>
          The electric fields produced by single neurons are vanishingly small. However, when large numbers of cortical neurons fire rhythmically their activity can produce electric fields that are large enough to cross the surface of the skull. This process is influenced by many factors, including depth, orientation, and subtype of neurons, making it a topic of ongoing research.
        </PopUp>
        
        <PopUp onClose={() => this.setState({popUp3Visible: false})} visible={this.state.popUp3Visible}>
          As we fall asleep and go through the different sleep stages there are dramatic changes in rhythmic brain activity. However, when we shift from thinking about cats to thinking about dogs, for example, there is no such change.
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

  image: {
    flex: 1,
    width: null,
    height: null,
  },

  currentTitle: {
    marginLeft: 20,
    marginTop: 10,
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    color: '#72C2F1',
  },

body: {
    fontFamily: 'Roboto-Light',
    color: '#4AB4E3',
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

});

export default connect(mapStateToProps)(SlideThree);