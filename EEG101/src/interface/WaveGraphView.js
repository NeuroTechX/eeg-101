// PSDGraphView.js
// The interface layer between JS and Java. Most of the work is handled internally by react-native, so all that is necessary to here is to define the PropTypes that will be communicated from JS to the Java component
import { PropTypes } from 'react';
import { requireNativeComponent, View, StyleSheet, Text } from 'react-native';
import React, { Component } from 'react';
import Svg, { Rect, Line } from 'react-native-svg';

let WaveGraph = requireNativeComponent('PSD_GRAPH', WaveGraphView);

export default class WaveGraphView extends Component{
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

        <WaveGraph style={[styles.graph, {
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

          <Rect
            x='0%'
            y='0%'
            width='8%'
            height="100%"
            fill='#1B998B'
            fillOpacity='0.5'
          />

          <Rect
            x='8%'
            y='0%'
            width='8%'
            height="100%"
            fill='#FFDC6B'
            fillOpacity='0.5'
          />

          <Rect
            x='16%'
            y='0%'
            width='10%'
            height="100%"
            fill='#FFFD82'
            fillOpacity='0.5'
          />

          <Rect
            x='26%'
            y='0%'
            width='34%'
            height="100%"
            fill='#FF9B71'
            fillOpacity='0.5'
          />

          <Rect
            x='60%'
            y='0%'
            width='40%'
            height="100%"
            fill='#E84855'
            fillOpacity='0.5'
          />

        </Svg>

        <Text style={[styles.domainLabel, {
          left: 50,
          bottom: 10,
        }]}>δ</Text>

        <Text style={[styles.domainLabel, {
          left: 50 + this.props.dimensions.width * .08,
          bottom: 10,
        }]}>θ</Text>

        <Text style={[styles.domainLabel, {
          left: 50 + this.props.dimensions.width * .16,
          bottom: 10,
        }]}>α</Text>

        <Text style={[styles.domainLabel, {
          left: 50 + this.props.dimensions.width * .34,
          bottom: 10,
        }]}>β</Text>

        <Text style={[styles.domainLabel, {
          left: 50 + this.props.dimensions.width * .65,
          bottom: 10,
        }]}>γ</Text>



      </View>
    )
  }
}

WaveGraphView.propTypes = {
  dimensions: PropTypes.object,
  visibility: PropTypes.bool,
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