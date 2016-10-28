import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid
} from 'react-native';
import{
  Actions,
}from 'react-native-router-flux';
import { connect } from 'react-redux';

//Interfaces. For advanced elements such as graphs
//import EEG_GRAPH from '../interface/GraphView';
import Button from '../components/Button';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';

class SlideNine extends Component {
  constructor(props) {
    super(props);

      // Initialize States
    this.state = {
      popUp1Visible: false,
      popUp2Visible: false,
    }
  }

  render() {
    return (
      <View style={styles.container}>
      
        <View style={styles.graphContainer}>
          <Text>Fourier Transform animation</Text>
        </View>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>What are the features we extract from the EEG?</Text>
            <Text style={styles.body}>A complex signal like the EEG can be decomposed into a sum of many simpler periodic signals or 
             <PopUpLink onPress={() => this.setState({popUp1Visible: true})}> waves.</PopUpLink>
            </Text>
          </View>
          
          <View style={styles.pageStyle}>
            <Text style={styles.body}>We can extract frequency information from EEG epochs using the 
             <PopUpLink onPress={() => this.setState({popUp2Visible: true})}> Fourier Transform</PopUpLink>
            </Text>
            <Button onPress={Actions.SlideTen}>Next</Button>
          </View>
        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUp1Visible: false})} visible={this.state.popUp1Visible}>
          Each wave is characterized by a certain frequency (number of cycles per second, or Hertz (Hz)). A high frequency wave has a lot of cycles per second, whereas a low frequency wave has few cycles per second. We are interested in looking at the relative strength of the simple waves that make up a complex signal like the EEG.
        </PopUp>

        <PopUp onClose={() => this.setState({popUp2Visible: false})} visible={this.state.popUp2Visible}>
The Fourier Transform is a mathematical function that can decompose a signal into the frequencies or waves that make it up. Often, we use an algorithm called the Fast Fourier Transform (FFT) to perform this decomposition in EEG.
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

export default connect(({route}) => ({route}))(SlideNine);