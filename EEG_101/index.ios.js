/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';
import{
  Router,
  Scene,
  Actions,
}from 'react-native-router-flux';

class AwesomeProject extends Component {
  render() {
    return (
      <Router hideNavBar={true}>
        <Scene key='root'>
          <Scene key='title' title="Title" component={Title} initial={true}/>
        </Scene>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  logo:{
    width:(Dimensions.get('window').width /2),

    height:(Dimensions.get('window').width /2 * 0.5101010101),
    alignItems: 'center',
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
