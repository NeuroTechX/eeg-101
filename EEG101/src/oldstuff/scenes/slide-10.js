import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
} from 'react-native';
import{
  Actions,
}from 'react-native-router-flux';

import Button from '../components/Button';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';
import { connect } from 'react-redux';

//Interfaces. For advanced elements such as graphs
//import EEG_GRAPH from '../interface/GraphView';

class SlideTen extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUpVisible: false,
    };

  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.graphContainer}>
        <Text>PSD Curve will go here</Text>
       </View>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>The EEG can be broken down</Text>
            <Text style={styles.body}>
              When we apply the Fourier Transform to the EEG, we obtain a measure of signal strength at given frequencies, represented in units of 
              <PopUpLink onPress={() => this.setState({popUpVisible: true})}> power.</PopUpLink>
            </Text>
            <Button onPress={Actions.SlideEleven}>Next</Button>
          </View>

        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUpVisible: false})} visible={this.state.popUpVisible}>
On the graph above, the x-axis shows the different frequencies which make up the EEG. The y-axis shows the signal strength for a given frequency, and is expressed in “power”, or volts squared.
        </PopUp>

      </View>
    );
  }
}

const styles = StyleSheet.create({

  pageStyle: {
    padding: 20,
    alignItems: 'stretch',
    justifyContent: 'space-around',
 },

body: {
    fontSize: 18,
  },

  container: {
    marginTop:55,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
},

  graphContainer: {
    backgroundColor: '#66ccff',
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    fontSize: 22,
  },


  viewPager: {
    flex: 3,
  },

});

export default connect(({route}) => ({route}))(SlideTen);