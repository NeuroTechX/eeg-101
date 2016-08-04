'use strict';

import React, {
  AppRegistry,
  Animated,
  Easing,
  Dimensions,
  LayoutAnimation,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {
  Surface,
  Shape,
} from 'ReactNativeART';

import { List } from 'immutable';
import WebSocket from 'WebSocket'

import MuseListener from './MuseListener';

// Create animated version of ReactNativeART Shape
const AnimatedShape = Animated.createAnimatedComponent(Shape);

// Get screen dimensions
const {width, height} = Dimensions.get('window');

// Socket server address
// const SOCKET_IP = 'http://192.168.0.100';
// const SOCKET_PORT = 9001;
// const SOCKET_PATH = 'data';

// Signal display surface dimensions
const SURFACE_WIDTH = width;
const SURFACE_HEIGHT = height * 0.4;

// Signal display information
const SIGNALS_COUNT = 4;
const SIGNAL_HEIGHT = SURFACE_HEIGHT / SIGNALS_COUNT;

// Data point display information
const POINTS_ON_SCREEN = 80;
const TOTAL_POINTS = POINTS_ON_SCREEN+1;
const POINT_SPACING = SURFACE_WIDTH / (POINTS_ON_SCREEN-1);

const UPDATE_INTERVALS_COUNT = 10;

// Expected data bounds
const DATA_LOWER_BOUND = 700;
const DATA_UPPER_BOUND = 925;

// Expected signal frequency (with padding) for animation
const SIGNAL_DELAY_MILLIS = 250;
const SIGNAL_ANIMATION_PADDING_MILLIS = 20;
const SIGNAL_ANIMATION_DURATION_MILLIS = SIGNAL_DELAY_MILLIS + SIGNAL_ANIMATION_PADDING_MILLIS;

// Signal line styling
const SIGNAL_STROKE_WIDTH = 3;
const SIGNAL_COLOURS = [
  "#3B2D38",
  "#F02475",
  "#F27435",
  "#CFBE27"
];

const MODAL_OFFSCREEN_WIDTH = 5;
const MODAL_PADDING_BOTTOM = 100;

const ReactArtTest = React.createClass({
  getInitialState() {
    return {
      dataPoints: {
        A1:  new List,
        FP1: new List,
        FP2: new List,
        A2:  new List
      },
      animationX: new Animated.Value(0),
      modalHeight: 0,
      modalTop: height,
      modalUp: false,
      updateIntervals: new List,
      previousUpdateTime: 0,
    }
  },

  componentDidMount() {
    // const ws = new WebSocket(`${SOCKET_IP}:${SOCKET_PORT}/${SOCKET_PATH}`);
    // ws.onopen = () => {
    //   console.log("OPEN!");
    // };

    // ws.onmessage = (e) => {
    //   let newPoints = JSON.parse(e.data);

    //   this.setState({
    //     dataPoints: {
    //       A1:  this.updateDataPoints(newPoints.A1,  this.state.dataPoints.A1),
    //       FP1: this.updateDataPoints(newPoints.FP1, this.state.dataPoints.FP1),
    //       FP2: this.updateDataPoints(newPoints.FP2, this.state.dataPoints.FP2),
    //       A2:  this.updateDataPoints(newPoints.A2,  this.state.dataPoints.A2)
    //     }},
    //     () => {
    //       //console.log(POINT_SPACING + this.state.animationX.__getValue());
    //       Animated.sequence([
    //         Animated.timing(this.state.animationX, {
    //           duration: 0,
    //           toValue:  0
    //         }),
    //         Animated.timing(this.state.animationX, {
    //           duration: SIGNAL_ANIMATION_DURATION_MILLIS,
    //           toValue:  -POINT_SPACING,
    //           easing:   Easing.linear
    //         })
    //       ]).start();
    //     }
    //   );
    // };

    MuseListener.connect();
    MuseListener.receiveMuseData((museData) => {
      let currentTime = Date.now();
      let updateInterval = SIGNAL_DELAY_MILLIS;
      if (this.state.previousUpdateTime !== 0) {
        updateInterval = currentTime - this.state.previousUpdateTime;
      }
      let updateIntervals = this.updateUpdateIntervals(updateInterval, this.state.updateIntervals);
      console.log(this.getAverageUpdateInterval(updateIntervals));
      this.setState({
        dataPoints: {
          A1:  this.updateDataPoints(museData.A1,  this.state.dataPoints.A1),
          FP1: this.updateDataPoints(museData.FP1, this.state.dataPoints.FP1),
          FP2: this.updateDataPoints(museData.FP2, this.state.dataPoints.FP2),
          A2:  this.updateDataPoints(museData.A2,  this.state.dataPoints.A2)
        },
        updateIntervals: updateIntervals,
        previousUpdateTime: currentTime
      },
      () => {
        //console.log(POINT_SPACING + this.state.animationX.__getValue());
        Animated.sequence([
          Animated.timing(this.state.animationX, {
            duration: 0,
            toValue:  0
          }),
          Animated.timing(this.state.animationX, {
            duration: SIGNAL_ANIMATION_DURATION_MILLIS,
            toValue:  -POINT_SPACING,
            easing:   Easing.linear
          })
        ]).start();
      });
    });
  },

  updateDataPoints(newPoint, dataPoints) {
    if (dataPoints.size === TOTAL_POINTS) {
      return dataPoints.unshift(newPoint).pop();
    } else {
      return dataPoints.unshift(newPoint);
    }
  },

  updateUpdateIntervals(newUpdateInterval, updateIntervals) {
    if (updateIntervals.size === UPDATE_INTERVALS_COUNT) {
      return updateIntervals.push(newUpdateInterval).shift();
    } else {
      return updateIntervals.push(newUpdateInterval);
    }
  },

  getAverageUpdateInterval(updateIntervals) {
    let sumOfUpdateIntervals = 0;
    let updateIntervalsCount = updateIntervals.forEach((updateInterval) => sumOfUpdateIntervals += updateInterval);
    return sumOfUpdateIntervals / updateIntervalsCount;
  },

  toggleModalView() {
    let newState = {};
    if (this.state.modalUp) {
      newState = {
        modalTop: height,
        modalUp: false
      };
      LayoutAnimation.configureNext(LayoutAnimation.create(
        100,
        LayoutAnimation.Types.linear,
        LayoutAnimation.Properties.opacity
      ));
    } else {
      newState = {
        modalTop: height - this.state.modalHeight,
        modalUp: true
      };
      LayoutAnimation.configureNext({
        duration: 400,
        create: {
          type: LayoutAnimation.Types.linear,
          property: LayoutAnimation.Properties.opacity
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 0.65
        }
      });
    }
    this.setState(newState);
  },

  render() {
    return (
      <View style={styles.container}>
        <StatusBar/>
        <View style={styles.connectButtonContainer}>
          <TouchableHighlight
            underlayColor='white'
            onPress={MuseListener.showMusePicker}>
            <View style={styles.connectButton}>
              <Text style={styles.connectButtonText}>
                Connect to Muse
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>
            This is your EEG signal.
          </Text>
        </View>
        <Surface width={SURFACE_WIDTH} height={SURFACE_HEIGHT}>
          <SignalLine
            dataPoints={this.state.dataPoints.A1} 
            x={this.state.animationX}
            y={0 * SIGNAL_HEIGHT}
            stroke={SIGNAL_COLOURS[0]}
          />
          <SignalLine
            dataPoints={this.state.dataPoints.FP1}
            x={this.state.animationX}
            y={1 * SIGNAL_HEIGHT}
            stroke={SIGNAL_COLOURS[1]}
          />
          <SignalLine
            dataPoints={this.state.dataPoints.FP2}
            x={this.state.animationX}
            y={2 * SIGNAL_HEIGHT}
            stroke={SIGNAL_COLOURS[2]}
          />
          <SignalLine
            dataPoints={this.state.dataPoints.A2}
            x={this.state.animationX}
            y={3 * SIGNAL_HEIGHT}
            stroke={SIGNAL_COLOURS[3]}
          />
          <Shape
            d={`M ${-SURFACE_WIDTH},0 L ${2*SURFACE_WIDTH},0 ${2*SURFACE_WIDTH},${SURFACE_HEIGHT} ${-SURFACE_WIDTH},${SURFACE_HEIGHT} Z`}
            stroke="gray"
            strokeWidth={1}
          />
        </Surface>
        <View style={styles.subheaderView}>
          <TouchableOpacity onPress={this.toggleModalView}>
            <Text style={styles.subheaderText}>
              It represents the electrical activity of your brain.
            </Text>
          </TouchableOpacity>
          <Text style={styles.modalText}>
            An electroencephalogram is a device that measures the electrical activity of the brain by
            recording subtle fluctuations in voltage at the surface of the skull. The first
            electroencephalogram was built in 1924 by Hans Berger, a German psychiatrist who knew very
            little about electricity and engineering, but applied techniques for measuring electrical
            fields to the brain in search of “psychic energy.” (Radin 2006, Entangled Minds, 21)
          </Text>
        </View>
        {/*<View
          onLayout={(e) => this.setState({modalHeight: e.nativeEvent.layout.height - MODAL_PADDING_BOTTOM})}
          style={[styles.modalView, {top: this.state.modalTop}]}>
          <TouchableWithoutFeedback onPress={this.toggleModalView} style={{flex:1}}>
            <Text style={styles.modalText}>
              An electroencephalogram is a device that measures the electrical activity of the brain by
              recording subtle fluctuations in voltage at the surface of the skull. The first
              electroencephalogram was built in 1924 by Hans Berger, a German psychiatrist who knew very
              little about electricity and engineering, but applied techniques for measuring electrical
              fields to the brain in search of “psychic energy.” (Radin 2006, Entangled Minds, 21)
            </Text>
          </TouchableWithoutFeedback>
        </View>*/}
      </View>
    );
  }
});

const SignalLine = React.createClass({
  generateDataLine(dataPoints) {
    if (dataPoints.size === 0) {
      return '';
    }

    let mappedPoint = mapToRange(dataPoints.get(0), DATA_LOWER_BOUND, DATA_UPPER_BOUND, SIGNAL_HEIGHT, 0);

    let startPos = SURFACE_WIDTH + POINT_SPACING;

    let dataLine = `M ${startPos*2},${mappedPoint}`;

    if (dataPoints.size > 1) {
      dataLine += ' L';

      dataPoints.forEach((value, index) => {
        let xCoord = startPos - (index * POINT_SPACING);
        let yCoord = mapToRange(value, DATA_LOWER_BOUND, DATA_UPPER_BOUND, SIGNAL_HEIGHT, 0);

        dataLine += ` ${xCoord},${yCoord}`;
      });
    }

    return dataLine;
  },

  render() {
    let dataLine = this.generateDataLine(this.props.dataPoints);
    return React.createElement(
      AnimatedShape,
      React.__spread(
        {}, this.props, {
          d: dataLine,
          strokeWidth: SIGNAL_STROKE_WIDTH
        }
      )
    );
  }
});

function mapToRange(value, in_min , in_max , out_min , out_max) {
  return Math.abs(( value - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  connectButtonContainer: {
    padding: 10,
    paddingTop: 20,
    alignItems: 'flex-end'
  },
  connectButton: {
    backgroundColor: '#555555',
    padding: 5,
    borderRadius: 2,
  },
  connectButtonText: {
    color: 'white',
    flex: 1
  },
  headerView: {
    padding: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  subheaderView: {
    flex: 1,
    padding: 15,
    paddingTop: 20,
  },
  subheaderText: {
    padding: 15,
    fontSize: 14,
    fontWeight: '200',
    textAlign: 'center',
  },
  modalView: {
    position: 'absolute',
    left: -MODAL_OFFSCREEN_WIDTH,
    width: width + 2 * MODAL_OFFSCREEN_WIDTH,
    backgroundColor: '#b0c4de',
    borderColor: 'black',
    borderWidth: 1,
    padding: 4,
    paddingHorizontal: 20,
    paddingBottom: 15 + MODAL_PADDING_BOTTOM
  },
  modalText: {
    padding: 10,
    paddingTop: 20,
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'justify',
    color: 'gray',
    fontStyle: 'italic',
  }
});

AppRegistry.registerComponent('ReactArtTest', () => ReactArtTest);
