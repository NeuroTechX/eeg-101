import React, { Component } from 'react';
import {
  View,
  AppRegistry,
  DeviceEventEmitter,
} from 'react-native';
import { NativeRouter, AndroidBackButton, Route, Link } from 'react-router-native'
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
import BCIRun from './src/scenes/bci-run.js';
import BCIOne from './src/scenes/bci-01.js';
import BCITwo from './src/scenes/bci-02.js';


// reducer is a function
import reducer from './src/redux/reducer';

// Connect Router to Redux
const RouterWithRedux = connect()(NativeRouter);

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
        <NativeRouter>
          <AndroidBackButton>
            <View style={{flex: 1}}>
              <Route exact path="/" component={Landing}/>
              <Route path="/connectorOne" component={ConnectorOne}/>
              <Route path="/connectorTwo" component={ConnectorTwo}/>
              <Route path="/connectorThree" component={ConnectorThree}/>
              <Route path="/slideOne" component={SlideOne}/>
              <Route path="/slideTwo" component={SlideTwo}/>
              <Route path="/slideThree" component={SlideThree}/>
              <Route path="/slideFour" component={SlideFour}/>
              <Route path="/slideFive" component={SlideFive}/>
              <Route path="/slideSix" component={SlideSix}/>
              <Route path="/slideSeven" component={SlideSeven}/>
              <Route path="/slideEight" component={SlideEight}/>
              <Route path="/slideNine" component={SlideNine}/>
              <Route path="/sandbox" component={Sandbox}/>
              <Route path="/end" component={End}/>
              <Route path="/bciOne" component={BCIOne}/>
              <Route path="/bciTwo" component={BCITwo}/>
              <Route path="/bciRun" component={BCIRun}/>
            </View>
          </AndroidBackButton>
        </NativeRouter>
      </Provider>
    );
  }
}

// Defines which component is the root for the whole project
AppRegistry.registerComponent('EEG_Project', () => EEG_Project);
