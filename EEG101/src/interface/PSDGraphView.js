// PSDGraphView.js
// In addition to importing the native PSDGraph, this component also draws axis and lines and labels with react-native-svg

import { PropTypes } from 'react';
import { requireNativeComponent, View, StyleSheet, Text } from 'react-native';
import React, { Component } from 'react';
import Svg, { Line } from 'react-native-svg';

let PSDGraph = requireNativeComponent('PSD_GRAPH', PSDGraphView);

export default class PSDGraphView extends Component{
  constructor(props) {
    super(props);
  }

  // Returns the callback ref from the child PSDGraph so that it can be used in SanboxGraph to send commands.
  // A bit of a hacky solution. Sometimes this function is called when the ref has been destroyed, throwing errors
  getChildRef() {
    if(this.graphRef !== null) { return this.graphRef
    }
  }

  render() {
    return(
      <View style={styles.graphContainer}>

        <PSDGraph style={[styles.graph, {
          left: this.props.dimensions.x + 50,
          bottom: 50,
          height: this.props.dimensions.height - 50,
          width: this.props.dimensions.width - 50
        }]} ref={(ref) => this.graphRef = ref} {...this.props}/>

        <Text style={[styles.rangeLabel, {
          left: this.props.dimensions.x,
          top: this.props.dimensions.height / 2.5,
        }]}>Power</Text>

        <Svg style={[styles.axesSVG, {
          left: this.props.dimensions.x + 50,
          bottom: 50,
          height: this.props.dimensions.height - 50,
          width: this.props.dimensions.width - 50
        }]}>

          <Line
            x1='0%'
            y1='100%'
            x2='0%'
            y2='0%'
            stroke='white'
            strokeWidth='3'
          />

          <Line
            x1='0%'
            y1='100%'
            x2='100%'
            y2='100%'
            stroke='white'
            strokeWidth='3'
          />

        </Svg>

        <Text style={[styles.domainLabel, {
          left: this.props.dimensions.width / 2.5,
          bottom: 10,
        }]}>Frequency</Text>

      </View>
    )
  }
}

PSDGraphView.propTypes = {
  dimensions: PropTypes.object,
  channelOfInterest: PropTypes.number,
  ...View.propTypes // include the default view properties
};

const styles=StyleSheet.create({
  graphContainer: {
    flex: 4,
    backgroundColor: '#72C2F1'
  },

  graph: {
    position: 'absolute',
  },

  axesSVG: {
    backgroundColor:'transparent',
    position: 'absolute',
  },

  rangeLabel: {
    color: 'white',
    position: 'absolute',
    fontSize: 18,
    transform: [{ rotate: '270deg'}],
  },

  domainLabel: {
    color: 'white',
    position: 'absolute',
    fontSize: 18,
    alignSelf: 'center'
  },


})
