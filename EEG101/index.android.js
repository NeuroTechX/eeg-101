import React, { Component } from "react";
import { View, AppRegistry, DeviceEventEmitter, StatusBar } from "react-native";
import {
  NativeRouter,
  AndroidBackButton,
  Route,
  Link,
  Switch
} from "react-router-native";
import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware, bindActionCreators } from "redux";
import { withRouter } from 'react-router';
import { closeMenu } from "./src/redux/actions";
import Drawer from "react-native-drawer";
import thunk from "redux-thunk";
import config from "./src/redux/config";
import { setConnectionStatus } from "./src/redux/actions";
import NavBar from "./src/components/NavBar";
import SideMenu from "./src/components/SideMenu.js";

// Scenes
import Landing from "./src/scenes/begin-landing";
import ConnectorOne from "./src/scenes/connector-01";
import ConnectorTwo from "./src/scenes/connector-02";
import ConnectorThree from "./src/scenes/connector-03";
import SlideOne from "./src/scenes/slide-01";
import SlideTwo from "./src/scenes/slide-02";
import SlideThree from "./src/scenes/slide-03";
import SlideFour from "./src/scenes/slide-04";
import SlideFive from "./src/scenes/slide-05";
import SlideSix from "./src/scenes/slide-06";
import SlideSeven from "./src/scenes/slide-07";
import SlideEight from "./src/scenes/slide-08";
import SlideNine from "./src/scenes/slide-09";
import Sandbox from "./src/scenes/sandbox";
import End from "./src/scenes/slide-end";
import BCIOne from "./src/scenes/bci-01.js";
import BCITwo from "./src/scenes/bci-02.js";
import BCIRun from "./src/scenes/bci-run.js";
import BCITrain from "./src/scenes/bci-train.js";

// reducer is a function
import reducer from "./src/redux/reducer";

function mapStateToProps(state) {
  return {
    open: state.isMenuOpen
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      onClose: closeMenu
    },
    dispatch
  );
}

// Connect SideMenu to Redux
const DrawerWithRedux = withRouter(connect(mapStateToProps, mapDispatchToProps)(Drawer));

// Create store
const store = createStore(reducer, applyMiddleware(thunk));

class EEG_Project extends Component {
  componentDidMount() {
    // This creates a persistent listener that will update connectionStatus when connection events are broadcast in Java
    DeviceEventEmitter.addListener("DISCONNECTED", event => {
      store.dispatch(setConnectionStatus(config.connectionStatus.DISCONNECTED));
    });

    DeviceEventEmitter.addListener("CONNECTED", event => {
      store.dispatch(setConnectionStatus(config.connectionStatus.CONNECTED));
    });
  }

  render() {
    // Provider component wraps everything in Redux and gives access to the store
    // RouterWithRedux manages allows store to be accessed
    // Each Scene component of Router corresponds to a different scene of the tutorial.
    // All scenes are wrapped in a root NavigationBar component that provides a custom navbar at the top of the screen
    // previous slide info is currently harcoded in as the 'previous' prop
    return (
      <Provider store={store}>
        <NativeRouter>
          <AndroidBackButton>
            <View style={{ flex: 1 }}>
              <StatusBar backgroundColor='#2c85b9'/>
              <DrawerWithRedux
                content={
                  <SideMenu drawer={this.ref}
                  />
                }
                type='overlay'
                tapToClose={true}
                openDrawerOffset={0.2} // 20% gap on the right side of drawer
                panCloseMask={.2}
                closedDrawerOffset={-3}
                captureGestures='open'
                styles={{
                  drawer: {elevation: 3},
                  main: {paddingLeft: 3}
                }}
                tweenHandler={(ratio) => ({main: {opacity: (2 - ratio) / 2, backgroundColor: 'black',}})}
                >
              <NavBar />
              <Switch>
                <Route exact path="/" component={Landing} />
                <Route path="/connectorOne" component={ConnectorOne} />
                <Route path="/connectorTwo" component={ConnectorTwo} />
                <Route path="/connectorThree" component={ConnectorThree} />
                <Route path="/slideOne" component={SlideOne} />
                <Route path="/slideTwo" component={SlideTwo} />
                <Route path="/slideThree" component={SlideThree} />
                <Route path="/slideFour" component={SlideFour} />
                <Route path="/slideFive" component={SlideFive} />
                <Route path="/slideSix" component={SlideSix} />
                <Route path="/slideSeven" component={SlideSeven} />
                <Route path="/slideEight" component={SlideEight} />
                <Route path="/slideNine" component={SlideNine} />
                <Route path="/sandbox" component={Sandbox} />
                <Route path="/end" component={End} />
                <Route path="/bciOne" component={BCIOne} />
                <Route path="/bciTwo" component={BCITwo} />
                <Route path="/bciRun" component={BCIRun} />
                <Route path="/bciTrain" component={BCITrain} />
              </Switch>
            </DrawerWithRedux>
            </View>
          </AndroidBackButton>
        </NativeRouter>
      </Provider>
    );
  }
}

// Defines which component is the root for the whole project
AppRegistry.registerComponent("EEG_Project", () => EEG_Project);
