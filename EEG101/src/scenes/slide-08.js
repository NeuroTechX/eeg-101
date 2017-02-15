import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  Image
} from 'react-native';
import{
  Actions,
}from 'react-native-router-flux';
import { connect } from 'react-redux';

//Interfaces. For advanced elements such as graphs
import PSDGraphView from '../interface/PSDGraphView';

import Button from '../components/Button';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
  return {
    isVisible: state.scene.sceneKey === 'SlideEight',
    dimensions: state.graphViewDimensions,
  };

}

class SlideEight extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUp1Visible: false,
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <PSDGraphView dimensions={this.props.dimensions} visibility={this.props.isVisible} />


        <Text style={styles.currentTitle}>PSD</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>


          <View style={styles.pageStyle}>
            <Text style={styles.header}>Power Spectral Density</Text>
            <Text style={styles.body}>When we apply the Fourier Transform to the EEG, we obtain a measure of signal strength at given frequencies, represented in units of <PopUpLink onPress={() => this.setState({popUp1Visible: true})}>power.</PopUpLink>
            </Text>
            <Button onPress={Actions.SlideNine}>NEXT</Button>
          </View>

        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUp1Visible: false})} visible={this.state.popUp1Visible}
               title="Power">
          In this graph, the X axis represents frequency and the Y axis represents power (microvolts squared, in decibels (dB)). Power represents how strong a certain frequency is in a complex signal. When power is high for only a few frequencies, it means that the signal is primarily composed of those few elements. If all frequencies have similar power, the signal will look random and be difficult to interpret.
        </PopUp>

      </View>
    );
  }
}

const styles = StyleSheet.create({

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
    fontSize: 17,
  },

  container: {
    marginTop:55,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },

  graphContainer: {
    backgroundColor: 'white',
    flex: 4,
    justifyContent: 'center',
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

  pageStyle: {
    padding: 20,
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },

  image: {
    flex: 1,
    width: null,
    height: null,
  },

});

export default connect(mapStateToProps)(SlideEight);