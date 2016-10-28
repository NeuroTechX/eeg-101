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

class SlideEight extends Component {
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
            <Text>Raw History plot goes here</Text>
        </View>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>

          
          <View style={styles.pageStyle}>
            <Text style={styles.header}>Preparing the signal for analysis</Text>
            <Text style={styles.body}>Finally, we extract signal attributes that change according to brain state. These attributes are known as
             <PopUpLink onPress={() => this.setState({popUpVisible: true})}> features</PopUpLink>
            </Text>
            <Button onPress={Actions.SlideNine}>Next</Button>
          </View>
        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUpVisible: false})} visible={this.state.popUpVisible}>
          For example, a typical EEG feature is the strength of different frequencies inside the signal (see next section). To obtain features, mathematical transformations are applied to the EEG epochs.    
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
    flex: 4,
  },

});

export default connect(({route}) => ({route}))(SlideEight);