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
import GraphView from '../interface/GraphView';

import Button from '../components/Button';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {isVisible: state.scene.sceneKey === 'SlideFive'};
  }

class SlideFive extends Component {
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
      
        <View style={styles.graphContainer}>
            <Image source={require('../assets/epoching.gif')}
                style={styles.image}
                resizeMode='contain'/>
          </View>

          <Text style={styles.currentTitle}>EPOCHING</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Chunking the signal</Text>
            <Text style={styles.body}>Next, the EEG is divided into small segments or <PopUpLink onPress={() => this.setState({popUpVisible: true})}>'epochs.'</PopUpLink>
             
            </Text>
            <Button onPress={Actions.SlideSix}>NEXT</Button>
          </View>
          
        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUpVisible: false})} visible={this.state.popUpVisible}
        title='Epochs'>The brain is constantly changing and the EEG changes with it. Dividing the EEG into epochs allows each moment in time to be analyzed individually. Analyzing how the properties of these epochs vary allows us to quantify how the brain changes over time.
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
    fontSize: 19,
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

export default connect(mapStateToProps)(SlideFive);