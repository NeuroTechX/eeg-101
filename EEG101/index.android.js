import React, { Component } from "react";
import { View, AppRegistry, StatusBar } from "react-native";
import {NativeRouter,AndroidBackButton,Route,Switch} from "react-router-native";
import { setMenu } from "./src/redux/actions";
import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware, bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Drawer from "react-native-drawer";
import thunk from "redux-thunk";
import NavBar from "./src/components/NavBar";
import SideMenu from "./src/components/SideMenu";
import * as colors from "./src/styles/colors.js";



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
import OfflineSlideOne from "./src/scenes/offlineMode/slide-01";
import OfflineSlideThree from "./src/scenes/offlineMode/slide-03";
import OfflineSlideFour from "./src/scenes/offlineMode/slide-04";
import OfflineSlideEight from "./src/scenes/offlineMode/slide-08";
import OfflineSlideNine from "./src/scenes/offlineMode/slide-09";

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
      onClose: () => setMenu(false)
    },
    dispatch
  );
}

// Connect SideMenu to Redux
const DrawerWithRedux = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Drawer)
);

// Create store
const store = createStore(reducer, applyMiddleware(thunk));

const mainViewStyle = { flex: 1 };
export default class EEG101 extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <NativeRouter>
          <AndroidBackButton>
            <View style={mainViewStyle}>
              <StatusBar backgroundColor={colors.mariner}/>
              <DrawerWithRedux
                content={<SideMenu drawer={this.ref} />}
                type="overlay"
                tapToClose={true}
                openDrawerOffset={0.2} // 20% gap on the right side of drawer
                panCloseMask={0.2}
                closedDrawerOffset={-5}
                captureGestures="open"
                styles={{
                  drawer: { elevation: 3 },
                  main: { paddingLeft: 3 }
                }}
                tweenHandler={ratio => ({
                  main: { opacity: (2 - ratio) / 2, backgroundColor: "black" }
                })}
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
                  <Route path="/offline/slideOne" component={OfflineSlideOne} />
                  <Route path="/offline/slideTwo" component={SlideTwo} />
                  <Route
                    path="/offline/slideThree"
                    component={OfflineSlideThree}
                  />

                  <Route
                    path="/offline/slideFour"
                    component={OfflineSlideFour}
                  />
                  <Route path="/offline/slideFive" component={SlideFive} />
                  <Route path="/offline/slideSix" component={SlideSix} />
                  <Route path="/offline/slideSeven" component={SlideSeven} />
                  <Route
                    path="/offline/slideEight"
                    component={OfflineSlideEight}
                  />
                  <Route
                    path="/offline/slideNine"
                    component={OfflineSlideNine}
                  />
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

AppRegistry.registerComponent("EEG101", () => EEG101);
