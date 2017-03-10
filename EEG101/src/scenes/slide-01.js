import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  Image,
} from 'react-native';
import{
  Actions,
  ActionConst
}from 'react-native-router-flux';
import { connect } from 'react-redux';
import config from '../redux/config';
import { bindActionCreators } from 'redux';
import { setGraphViewDimensions } from '../redux/actions';
import Button from '../components/Button';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';
import { MediaQueryStyleSheet} from 'react-native-responsive';

//Interfaces. For elements that bridge to native
import GraphView from '../interface/GraphView';


// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
  return {
    isVisible: state.scene.sceneKey === 'SlideOne',
    connectionStatus: state.connectionStatus,
  };
}

// Binds actions to component's props
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setGraphViewDimensions,
  }, dispatch);
}

class SlideOne extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUp1Visible: false,
      popUp2Visible: false,
      popUp3Visible: false,
      popUp4Visible: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>

        <View  style={styles.graphContainer} onLayout={(event) => {
          // Captures the width and height of the graphContainer to determine overlay positioning properties in PSDGraph
          let {x, y, width, height} = event.nativeEvent.layout;
          console.log(x, y, width, height);
          this.props.setGraphViewDimensions({x: x, y: y, width: width, height: height})
        }}>
          <GraphView style={{flex:1}} visibility={this.props.isVisible}/>
        </View>

        <Text style={styles.currentTitle}>INTRODUCTION</Text>

          <ViewPagerAndroid //Allows us to swipe between blocks
            style={styles.viewPager}
            initialPage={0}>

            <View style={styles.pageStyle}>
              <Text style={styles.header}>Your brain produces electricity</Text>
              <Text style={styles.body}>
                Using the <PopUpLink onPress={() => this.setState({popUp1Visible: true})}>EEG</PopUpLink> device that you are wearing, we can detect the electrical activity of your brain.
              </Text>
              <Image source={require('../assets/swipeicon.png')} resizeMode='contain' style={styles.swipeImage}/>
            </View>

            <View style={styles.pageStyle}>
              <Text style={styles.header}>Try blinking your eyes...</Text>
              <Text style={styles.body}>Does the signal change?</Text>
              <Text style={styles.body}>Eye movements create <PopUpLink onPress={() => this.setState({popUp2Visible: true})}>noise</PopUpLink> in the EEG signal.
              </Text>
            </View>

            <View style={styles.pageStyle}>
              <Text style={styles.header}>Try thinking about a cat... </Text>
              <Text style={styles.body}>Does the signal change?</Text>
              <Text style={styles.body}>Although EEG can measure overall brain activity, it’s not capable of <PopUpLink onPress={() => this.setState({popUp3Visible: true})}>reading minds.</PopUpLink>
              </Text>
            </View>

            <View style={styles.pageStyle}>
              <Text style={styles.header}>Now try closing your eyes for 10 seconds</Text>
              <Text style={styles.body}>You may notice a change in your signal due to an increase in <PopUpLink onPress={() => this.setState({popUp4Visible: true})}>alpha waves.</PopUpLink>
              </Text>
              <Button onPress={Actions.SlideTwo}>NEXT</Button>
            </View>

          </ViewPagerAndroid>


        <PopUp onClose={() => this.setState({popUp1Visible: false})} visible={this.state.popUp1Visible}
               title='What exactly is EEG?' image={require('../assets/hansberger.jpg')}>
          Electroencephalography (EEG) is a technique that measures the electrical activity of the brain with sensors that record fluctuations in voltage at the surface of the skull. The first human electroencephalogram was recorded in 1924 by Hans Berger, a German psychiatrist whose interest in ‘psychic energy’ led him to experiment with the electrical fields of the brain.
        </PopUp>

        <PopUp onClose={() => this.setState({popUp2Visible: false})} visible={this.state.popUp2Visible}
               title='Noise'>
          Movement of the eyes (which are electrically charged) and muscle activity produce electrical activity. Thus, blinking, swallowing, and clenching the jaw will all produce noise that can overpower signals originating in the brain. This can make it very difficult to read the EEG. To accurately sense the activity of the brain, movement must be kept to a minimum.
        </PopUp>

        <PopUp onClose={() => this.setState({popUp3Visible: false})} visible={this.state.popUp3Visible}
               title='EEG cannot read minds'>
          The EEG signal is generated when tens of thousands of brain cells fire in synchrony. Although thinking about a cat produces some change in brain activity, it is too small to affect the large-scale, rhythmic firing of the brain that EEG detects.
        </PopUp>

        <PopUp onClose={() => this.setState({popUp4Visible: false})} visible={this.state.popUp4Visible}
               title='Closed eye rhythms'>
          When the eyes are closed, there is often a large increase in rhythmic brain activity in the range of 8-13 cycles per second (Hz). These alpha waves were one of the first discoveries that Hans Berger made with EEG. The ability to detect alpha waves when the eyes are closed varies greatly from person to person, however. Don't feel bad if you can't see them!
        </PopUp>

        <PopUp onClose={Actions.ConnectorOne} visible={(this.props.isVisible && this.props.connectionStatus === config.connectionStatus.DISCONNECTED)} title='Muse Disconnected'>
          Please reconnect to continue the tutorial</PopUp>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SlideOne);

// Darker: #72C2F1
// Light: #97D2FC
const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    pageStyle: {
      padding: 15,
      alignItems: 'stretch',
      justifyContent: 'space-around',
    },

    currentTitle: {
      marginLeft: 20,
      marginTop: 10,
      fontSize: 13,
      fontFamily: 'Roboto-Medium',
      color: '#6CCBEF',
    },

    body: {
      fontFamily: 'Roboto-Light',
      color: '#484848',
      fontSize: 19,
    },

    container: {
      marginTop:55,
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'stretch',
    },

    graphContainer: {
      flex: 4,
      justifyContent: 'center',
      alignItems: 'stretch',
    },

      sandboxButtonContainer: {
        position: 'absolute',
        right: 5,
        top: 5,
      },

    header: {
      fontFamily: 'Roboto-Bold',
      color: '#484848',
      fontSize: 20,
    },

    viewPager: {
      borderWidth:1 ,
      flex: 4,
    },

    swipeImage: {
      height: 40,
      alignSelf: 'center'
    }

  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {

      viewPager: {
        flex: 3,
      },

      header: {
        fontSize: 30,
      },

      currentTitle: {
        fontSize: 20,
      },

      body: {
        fontSize: 25,
      },

      swipeImage: {
        height: 75,
        width: 75,
      },
    }
  });