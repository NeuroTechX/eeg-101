// PlayPauseButton.js
// A play/pause button that plays and pauses things

import React, { Component } from 'react';
import {
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import * as colors from "../styles/colors";

export default class PlayPauseButton extends Component{
  constructor(props){
    super(props);
  }

  render() {
    const imageSource = (this.props.isRunning) ? require('../assets/pause_icon.png') : require('../assets/play_icon.png');
    return(
      <TouchableOpacity onPress={this.props.onPress} disabled={this.props.disabled}>
        <Image source={imageSource} resizeMode='contain'
               style={{height: this.props.size, width: this.props.size, alignSelf: 'center'}}/>
      </TouchableOpacity>
    )
  }
};
