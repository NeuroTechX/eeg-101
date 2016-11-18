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
//import EEG_GRAPH from '../interface/GraphView';
import Button from '../components/Button';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {isVisible: state.scene.sceneKey === 'SlideEight'};
    
  }

class SlideEight extends Component {
  constructor(props) {
    super(props);

      // Initialize States
    this.state = {
      popUp1Visible: false,
      popUp2Visible: false,
    }
  }

  render() {
    return (
      <View style={styles.container}>
      
        <View style={styles.graphContainer}>
            <Image source={require('../assets/fourier.png')}
                style={styles.image}
                resizeMode='contain'/>
        </View>

        <Text style={styles.currentTitle}>FEATURE EXTRACTION</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>

          
          <View style={styles.pageStyle}>
            <Text style={styles.header}>Extracting features of the EEG</Text>
            <Text style={styles.body}>Finally, we extract signal attributes that change according to brain state. These attributes are known as
             <PopUpLink onPress={() => this.setState({popUp1Visible: true})}> features.</PopUpLink> 
            </Text>
           
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>How are features extracted?</Text>
            <Text style={styles.body}>Complex signals can be decomposed into a sum of many simpler signals or waves with a mathematical function known as the <PopUpLink onPress={() => this.setState({popUp2Visible: true})}> Fourier Transform.</PopUpLink>
            </Text>
            <Button onPress={Actions.End}>Next</Button>
            
          </View>
        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUp1Visible: false})} visible={this.state.popUp1Visible}
        title="Features">
        An EEG feature can be thought of as the strength of a certain frequency inside the signal. Different frequencies represent different characteristics of brain activity.   
        </PopUp>
        <PopUp onClose={() => this.setState({popUp2Visible: false})} visible={this.state.popUp2Visible}
        title="Fourier transform">
        The Fourier Transform is a mathematical function that can decompose a signal into the frequencies or waves that make it up. Often, we use an algorithm specifically called the Fast Fourier Transform (FFT) to perform this decomposition in EEG.
        </PopUp>
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

export default connect(mapStateToProps)(SlideEight);