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



//  Custom scene imports
import Landing from './src/scenes/landing';
import ConnectorOne from './src/scenes/connector-01';
import ConnectorTwo from './src/scenes/connector-02';
import ConnectorThree from './src/scenes/connector-03';
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
import config from './config';
import { setConnectionStatus } from './actions';
const RouterWithRedux = connect()(Router);
// reducer is a function
import reducer from './reducer';

// Create store
const store = createStore(reducer, applyMiddleware(thunk)); 

class EEG_Project extends Component {


  componentDidMount() {

    // This creates a persistent listener that will update connectionStatus when connection events are broadcast in Java
    DeviceEventEmitter.addListener('DISCONNECTED', (event) => {
      console.log('disconnection event detected in JS');
      store.dispatch(setConnectionStatus(config.connectionStatus.DISCONNECTED));
    });

    DeviceEventEmitter.addListener('CONNECTED', (event) => {
      console.log('connection event detected in JS');
      store.dispatch(setConnectionStatus(config.connectionStatus.CONNECTED));
    });
  }

  render() {
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
            <Scene component={End} key='End' previous='HARDWARE'/>
          </Scene>
        </RouterWithRedux>
      </Provider>
    );
  }
}

// Defines which component is the root for the whole project
AppRegistry.registerComponent('EEG_Project', () => EEG_Project);
