/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/
//var Swiper = require('react-native-swiper');
import Swiper from 'react-native-swiper';
import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  requireNativeComponent,
  NativeModules,
} from 'react-native';
import{
  Router,
  Scene,
  Actions,
}from 'react-native-router-flux'
import Config from './config';
//import ToastAndroid from './ToastAndroid';
const CARD_PREVIEW_WIDTH = 20
const CARD_MARGIN = 5;
const CARD_WIDTH = Dimensions.get('window').width - (CARD_MARGIN + CARD_PREVIEW_WIDTH) * 2;


export default class donepage extends Component {
  //ToastAndroid.show('Awesome', ToastAndroid.SHORT);
  render() {
    return (

        <View style={styles.container}>
        <Text> Conlaturation, you have completed a great tutorial </Text>
        <Text> You're winner </Text>
        <Text> All your brain are belong to us </Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3668c1',
    flex: 1,
    alignItems: 'center',
  },
});
