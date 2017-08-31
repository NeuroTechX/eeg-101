// An activity indicator that will also display a NoiseIndicator if noise is present during data collection
import React, { Component } from "react";
import {
  ActivityIndicator,
  NativeEventEmitter,
  NativeModules
} from "react-native";
import NoiseIndicator from "./NoiseIndicator.js";
import Classifier from "../interface/Classifier.js";

export default class DataCollectionIndicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noise: []
    };
  }

  componentDidMount() {
    const noiseListener = new NativeEventEmitter(NativeModules.Classifier);
    this.noiseSubscription = noiseListener.addListener("NOISE", message => {
      this.setState({ noise: Object.keys(message) });
    });
  }

  componentWillUnmount(){
    this.noiseSubscription.remove();
  }

  render() {
    console.log(this.state.noise);
    if (this.state.noise.length >= 1) {
      return <NoiseIndicator noise={this.state.noise} width={40} height={40} />;
    } else {
      return <ActivityIndicator color={"#94DAFA"} size={"large"} />;
    }
  }
}
