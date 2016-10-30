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
import GraphView from '../interface/GraphView';

import Button from '../components/Button';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {isVisible: state.scene.sceneKey === 'SlideSix'};
  }

class SlideSix extends Component {
  constructor(props) {
    super(props);
    isVisible: true;


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
          </View>
          <View style={styles.halfGraphContainer}>
            <GraphView style={{flex:1}} visibility={this.props.isVisible}/>
          </View>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Preparing the signal for analysis.</Text>
            <Text style={styles.body}>First, the signal must be “cleaned” to extract unwanted 
             <PopUpLink onPress={() => this.setState({popUpVisible: true})}> noise.</PopUpLink>
            </Text>
            <Button onPress={Actions.SlideSeven}>Next</Button>
          </View>
          
        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUpVisible: false})} visible={this.state.popUpVisible}>
          To remove or reduce the impact of these sources of noise, we use “filters” that attenuate the irrelevant components of the signal. 
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

  halfGraphContainer: {
    
    flex: 2,
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  header: {
    fontSize: 22,
  },


  viewPager: {
    flex: 4,
  },

});

export default connect(mapStateToProps)(SlideSix);