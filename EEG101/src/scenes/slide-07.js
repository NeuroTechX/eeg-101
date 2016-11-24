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
    return {isVisible: state.scene.sceneKey === 'SlideSeven'};
  }

class SlideSeven extends Component {
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
          <Image source={require('../assets/artifact.png')}
                style={styles.image}
                resizeMode='contain'/>
        </View>

        <Text style={styles.currentTitle}>ARTIFACT REMOVAL</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>

          
          <View style={styles.pageStyle}>
            <Text style={styles.header}>Removing noise</Text>
            <Text style={styles.body}>After the EEG has been divided into epochs, those that contain a <PopUpLink onPress={() => this.setState({popUpVisible: true})}> significant amount</PopUpLink> of noise can be removed.             
            </Text>
            <Button onPress={Actions.SlideEight}>Next</Button>
          </View>

        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUpVisible: false})} visible={this.state.popUpVisible}
        title="Artifact detection">
        One simple way to define what a 'significant amount of noise' is to compare the range of an epoch to its neighbouring epochs. If one segment of the EEG fluctuated a lot more than its neighbours, get rid of it!
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
    backgroundColor: '#72c2f1',
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

export default connect(mapStateToProps)(SlideSeven);