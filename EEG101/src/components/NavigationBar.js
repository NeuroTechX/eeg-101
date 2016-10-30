// NavigationBar.js
// Custom built navbar for navigating the app
import React, {Component} from 'react';

import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

import { connect } from 'react-redux';

import {Actions, DefaultRenderer} from "react-native-router-flux";
import backButtonIcon from '../assets/back_chevron.png';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  getSceneKey(state) {
    return {sceneKey: state.scene.sceneKey};
  }


class NavigationBar extends Component {
  constructor (props) {
    super(props);
    sceneKey: null;
  }	

  // Searches through children of scenes to find the currently active scene with no subscenes.
  // Probably not necessary for this version of the app as we do not have subscenes
  getSelectedComponent (navigationState) {
    let selected = navigationState.children[navigationState.index];
    while (selected.hasOwnProperty("children")) {
      selected = selected.children[selected.index]
    }
    return selected;
  }
  
  renderBackText (childState: NavigationState) {
    return (
      <Text
        style={styles.titleText}>
        BACK: {childState.previous}
      </Text>
    );
  }

  renderBackButton (childState: NavigationState) {
    if (childState.hideBackButton === undefined || !childState.hideBackButton &&
        this.props.showBackButton) {
      return (
        <TouchableOpacity
          style={styles.navBack}
          onPress={Actions.pop}>
          <Image source={backButtonIcon} style={{height: 20}} resizeMode='contain'/>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }


  // Substituted !_.isNil with ! == null
  renderCenterContent (childState: NavigationState) {
    if (childState.previous != null) {
      return (
        <View style={styles.centerTextContainer}>
          {this.renderBackText(childState)}
        </View>
      );
    } else if (childState.titleComponent != null) {
      return (
        <View style={styles.centerComponentContainer}>
          <childState.titleComponent/>
        </View>
      );
    } 

    return (
      <View style={styles.centerImageContainer}>
        <Image
          style={{height: 35, width: 35}}
          source={require('../assets/eeg101logo.png')}
        />
      </View>
    );
  }

  renderNavBar (navigationState) {
    let selected = this.getSelectedComponent(navigationState);
    // Double bang operator forces value to be a boolean
    if (!!selected.hideNavBar) return null;
    return (
      <Animated.View style={styles.container}>
        <StatusBar barStyle='light-content'/>
        <View style={styles.content}>
          <View style={styles.leftContent}>
            {this.renderBackButton(selected)}
          </View>
          <View style={styles.centerContent}>
            {this.renderCenterContent(selected)}
          </View>
        </View>
      </Animated.View>
    );
  }

  render() {
    return this.renderNavBar(this.props.navigationState);
  }
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#97D2FC',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 55,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row'
  },
  leftContent: {
    paddingLeft: 20,
    justifyContent: 'center'
  },
  centerContent: {
    flex: 4
  },
  centerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  centerComponentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',

  },
  titleText: {
  	fontFamily: 'Roboto-Bold',
  	color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  rightContent: {
    flex: 1,
    paddingRight: 8,
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  navBack: {
    alignItems: 'flex-start',
    left: -10,

  }
});

export default connect(getSceneKey)(NavigationBar);
