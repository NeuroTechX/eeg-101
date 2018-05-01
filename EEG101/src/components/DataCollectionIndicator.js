// An activity indicator that will also display a NoiseIndicator if noise is present during data collection
import React, { Component } from "react";
import {
  ActivityIndicator,
} from "react-native";
import NoiseIndicator from "./NoiseIndicator.js";

export default class DataCollectionIndicator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.noise.length >= 1) {
      return <NoiseIndicator noise={this.props.noise} width={50} height={50} />;
    } else {
      return <ActivityIndicator color={"#94DAFA"} size={"large"} />;
    }
  }
}
