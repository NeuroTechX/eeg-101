import React, { Component } from 'react';
import {
  AppRegistry,
  DeviceEventEmitter,
} from 'react-native';
import{
  Router,
  Scene,
}from 'react-native-router-flux';
import{ Provider, connect }from 'react-redux';
import{ createStore, applyMiddleware }from 'redux';
import thunk from 'redux-thunk';
import config from './src/redux/config';
import { setConnectionStatus } from './src/redux/actions';

// Scenes
import Landing from './src/scenes/begin-landing';
import ConnectorOne from './src/scenes/connector-01';
import ConnectorTwo from './src/scenes/connector-02';
import ConnectorThree from './src/scenes/connector-03';
import SlideOne from './src/scenes/slide-01';
import SlideTwo from './src/scenes/slide-02';
import SlideThree from './src/scenes/slide-03';
import SlideFour from './src/scenes/slide-04';
import SlideFive from './src/scenes/slide-05';
import SlideSix from './src/scenes/slide-06';
import SlideSeven from './src/scenes/slide-07';
import SlideEight from './src/scenes/slide-08';
import SlideNine from './src/scenes/slide-09';
import Sandbox from './src/scenes/sandbox';
import End from './src/scenes/slide-end';

// Navbar import
import NavigationBar from './src/components/NavigationBar.js';

// reducer is a function
import reducer from './src/redux/reducer';

// Connect Router to Redux
const RouterWithRedux = connect()(Router);

// Create store
const store = createStore(reducer, applyMiddleware(thunk)); 

class EEG_Project extends Component {

  componentDidMount() {
    // This creates a persistent listener that will update connectionStatus when connection events are broadcast in Java
    DeviceEventEmitter.addListener('DISCONNECTED', (event) => {
      store.dispatch(setConnectionStatus(config.connectionStatus.DISCONNECTED));
    });

    DeviceEventEmitter.addListener('CONNECTED', (event) => {
      store.dispatch(setConnectionStatus(config.connectionStatus.CONNECTED));
    });
  }

  render() {
    // Provider component wraps everything in Redux and gives access to the store
    // RouterWithRedux manages transitions between Scenes with Actions.SCENE_KEY calls
    // Each Scene component of Router corresponds to a different scene of the tutorial.
    // All scenes are wrapped in a root NavigationBar component that provides a custom navbar at the top of the screen
    // previous slide info is currently harcoded in as the 'previous' prop
    return (
      <Provider store={store}>
        <RouterWithRedux>
          <Scene key="root" navBar={NavigationBar}>
            <Scene component={Landing} key='Landing' initial={true} hideNavBar={true}/>
            <Scene component={ConnectorOne} key='ConnectorOne' hideNavBar={true}/>
            <Scene component={ConnectorTwo} key='ConnectorTwo' hideNavBar={true}/>
            <Scene component={ConnectorThree} key='ConnectorThree' hideNavBar={true}/>
            <Scene component={SlideOne} key='SlideOne' previous='CONNECTION' hideNavBar={false}/>
            <Scene component={SlideTwo} key='SlideTwo'previous='INTRODUCTION'/>
            <Scene component={SlideThree} key='SlideThree'previous='PHYSIOLOGY'/>
            <Scene component={SlideFour} key='SlideFour' previous='HARDWARE'/>
            <Scene component={SlideFive} key='SlideFive' previous='FILTERING'/>
            <Scene component={SlideSix} key='SlideSix' previous='EPOCHING'/>
            <Scene component={SlideSeven} key='SlideSeven' previous='ARTEFACT REMOVAL'/>
            <Scene component={SlideEight} key='SlideEight' previous='FEATURE EXTRACTION'/>
            <Scene component={SlideNine} key='SlideNine' previous='PSD'/>
            <Scene component={Sandbox} key='Sandbox' previous='LESSON' hideNavBar={true}/>
            <Scene component={End} key='End' previous='SANDBOX'/>
          </Scene>
        </RouterWithRedux>
      </Provider>
    );
  }
}

// Defines which component is the root for the whole project
AppRegistry.registerComponent('EEG_Project', () => EEG_Project);
