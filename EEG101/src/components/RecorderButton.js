// RecorderButton.js
// Dynamic button that switches between a red button or square to indicate recording start/stop

import React, { Component } from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default class RecordingButton extends Component{
  constructor(props){
    super(props);
  }

  render() {
    const imageSource = (this.props.isRecording) ? require('../assets/stop.png') : require('../assets/record.png');

    return(
      <TouchableOpacity onPress={this.props.onPress}>
        <Image source={imageSource} style={{width: 40, height: 40}} resizeMode='contain'/>
      </TouchableOpacity>
    )
  }
};
