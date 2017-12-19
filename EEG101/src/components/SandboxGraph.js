// SandboxGraphGraph.js
// A view that allows the user switch between viewing different types of EEG Graphs. Stores the current graph type as a prop
// When switching between graphs, tells active graphs to stop all threads

import React, { Component } from "react";
import {
  UIManager,
  findNodeHandle
} from "react-native";
import config from "../redux/config";

// Interfaces
import GraphView from "../native/GraphView";
import FilterGraphView from "../native/FilterGraphView";
import PSDGraphView from "../native/PSDGraphView";
import WaveGraphView from "../native/WaveGraphView";

export default class SandboxGraph extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.graphType !== nextProps.graphType) {
      this.stopThreads();
    }
  }

  stopThreads() {
    UIManager.dispatchViewManagerCommand(findNodeHandle(this.graphRef), 0, []);
  }

  render() {
    switch (this.props.graphType) {
      case config.graphType.EEG:
        return (
          <GraphView
            notchFrequency={this.props.notchFrequency}
            style={{ flex: 1 }}
            ref={ref => (this.graphRef = ref)}
            channelOfInterest={this.props.channelOfInterest}
            isRecording={this.props.isRecording}
          />
        );

      case config.graphType.FILTER:
        return (
          <FilterGraphView
            notchFrequency={this.props.notchFrequency}
            style={{ flex: 1 }}
            ref={ref => (this.graphRef = ref)}
            channelOfInterest={this.props.channelOfInterest}
            filterType={this.props.filterType}
            isRecording={this.props.isRecording}
          />
        );

      case config.graphType.PSD:
        return (
          <PSDGraphView
            ref={ref => {
              if (ref !== null) {
                this.graphRef = ref.getChildRef();
              }
            }}
            channelOfInterest={this.props.channelOfInterest}
            dimensions={this.props.dimensions}
            isRecording={this.props.isRecording}
          />
        );

      case config.graphType.WAVES:
        return (
          <WaveGraphView
            ref={ref => {
              if (ref !== null) {
                this.graphRef = ref.getChildRef();
              }
            }}
            channelOfInterest={this.props.channelOfInterest}
            dimensions={this.props.dimensions}
            isRecording={this.props.isRecording}
          />
        );
    }
  }
}

SandboxGraph.defaultProps = {
  visibility: false,
  graphType: config.graphType.EEG,
  channelOfInterest: 1
};
