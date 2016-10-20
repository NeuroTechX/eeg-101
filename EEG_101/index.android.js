import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import{
  Router,
  Scene,
}from 'react-native-router-flux';
import{ Provider }from 'react-redux';
import { connect } from 'react-redux';
import{ createStore }from 'redux';


//  Custom scene imports
import Landing from './src/scenes/landing';
import SlideOne from './src/scenes/slide-01';
import SlideTwo from './src/scenes/slide-02';
import SlideThree from './src/scenes/slide-03';
import SlideFour from './src/scenes/slide-04';
import SlideFive from './src/scenes/slide-05';
//import SlideSix from './src/scenes/slide-06';
import SlideSeven from './src/scenes/slide-07';
import SlideEight from './src/scenes/slide-08';
import SlideNine from './src/scenes/slide-09';
import SlideTen from './src/scenes/slide-10';
import SlideEleven from './src/scenes/slide-11';
import End from './src/scenes/end';

// Navbar import
import NavigationBar from './src/components/NavigationBar.js';

// Redux imports
const RouterWithRedux = connect()(Router);
// reducer is a function
import reducer from './reducer';

// Create store
const store = (createStore)(reducer); 

/*
<Scene component={SlideThree} key='SlideThree' previous='PHYSIOLOGY'/>
            <Scene component={SlideFour} key='SlideFour' previous='HARDWARE'/>
            <Scene component={SlideFive} key='SlideFive' previous='SIGNAL PROCESSING OUTLINE'/>
            <Scene component={SlideSix} key='SlideSix' previous='High/Low Pass Filters' />
            <Scene component={SlideSeven} key='SlideSeven' previous='Epochs'/>
            <Scene component={SlideEight} key='SlideEight' previous='Feature Extraction'/>
            <Scene component={SlideNine} key='SlideNine' previous='The Fourier Transform'/>
            <Scene component={SlideTen} key='SlideTen' previous='Power Spectra Density'/>
            <Scene component={SlideEleven} key='SlideEleven' previous='Frequency Bands'/>
*/

class EEG_Project extends Component {
  render() {
    return (
      <Provider store={store}>
        <RouterWithRedux>
          <Scene key="root" navBar={NavigationBar}>
            <Scene component={Landing} key='Landing' initial={true} hideNavBar={true}/>
            <Scene component={SlideOne} key='SlideOne' previous='CONNECTION' hideNavBar={false}/>
            <Scene component={SlideTwo} key='SlideTwo'previous='INTRODUCTION'/>
            <Scene component={SlideThree} key='SlideThree'previous='PHYSIOLOGY'/>
            <Scene component={End} key='End' previous='HARDWARE'/>
          </Scene>
        </RouterWithRedux>
      </Provider>
    );
  }
}

// Defines which component is the root for the whole project
AppRegistry.registerComponent('EEG_Project', () => EEG_Project);
