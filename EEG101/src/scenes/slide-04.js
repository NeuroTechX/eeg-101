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
}from 'react-native-router-flux';
import { connect } from 'react-redux';
import Button from '../components/Button';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';
import { MediaQueryStyleSheet }  from 'react-native-responsive';


//Interfaces. For elements that bridge to native
import GraphView from '../interface/GraphView';
import FilterGraphView from '../interface/FilterGraphView';
import config from '../redux/config';


// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {
      isVisible: state.scene.sceneKey === 'SlideFour',
      connectionStatus: state.connectionStatus,
      dimensions: state.graphviewDimensions,
    };
  }



class SlideFour extends Component {
  constructor(props) {
    super(props);


      // Initialize States
    this.state = {
      popUpVisible: false,
    }
  }

  render() {
    return (
      <View style={styles.container}>
      
        <View style={styles.halfGraphContainer}>
          <GraphView style={{flex:1}} visibility={this.props.isVisible}/>
          <Text style={styles.halfGraphLabelText}>Raw</Text>
        </View>
        <View style={styles.halfGraphContainer}>
          <FilterGraphView style={{flex:1}} visibility={this.props.isVisible} filterType={config.filterType.LOWPASS}/>
          <Text style={styles.halfGraphLabelText}>Low-Pass Filter</Text>
        </View>

          <Text style={styles.currentTitle}>FILTERING</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>How do we get meaningful data from the EEG?</Text>
            <Text style={styles.body}>First, the EEG must be <PopUpLink onPress={() => this.setState({popUpVisible: true})}>filtered</PopUpLink> to reduce signals that don't come from the brain.
            </Text>
            <Button onPress={Actions.SlideFive}>NEXT</Button>
          </View>

        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUpVisible: false})} visible={this.state.popUpVisible}
               title="Filters">
          Filters remove frequencies that sit outside the spectrum of signals produced by the brain, getting rid of some of the noise produced by muscles or environmental electrical activity. Filters are normally either high-pass (removing low frequencies), low-pass (removing high frequencies) or band-pass (allowing only a specific band of frequencies through). Here, we have implemented a low-pass filter that removes high frequency noise.
        </PopUp>

      </View>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    pageStyle: {
      padding: 20,
      alignItems: 'stretch',
      justifyContent: 'space-around',
    },

    body: {
      fontFamily: 'Roboto-Light',
      color: '#484848',
      fontSize: 19,
    },

    currentTitle: {
      marginLeft: 20,
      marginTop: 10,
      fontSize: 13,
      fontFamily: 'Roboto-Medium',
      color: '#6CCBEF',
    },

    container: {
      marginTop: 55,
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'stretch',
    },

    header: {
      fontFamily: 'Roboto-Bold',
      color: '#484848',
      fontSize: 20,
    },


    viewPager: {
      flex: 4,
    },

    halfGraphContainer: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'stretch',

    },

    halfGraphLabelText: {
      position: 'absolute',
      top: 5,
      left: 5,
      fontSize: 13,
      fontFamily: 'Roboto-Medium',
      color: '#ffffff',
    },
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
      }
    }
  }
);

export default connect(mapStateToProps)(SlideFour);