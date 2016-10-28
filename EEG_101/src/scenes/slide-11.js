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
import { connect } from 'react-redux';

import Button from '../components/Button';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';
import PopUpList from '../components/PopUpList';
import ListItemBlock from '../components/ListItemBlock';

//Interfaces. For advanced elements such as graphs
//import EEG_GRAPH from '../interface/GraphView';

/* <ListItemBlock title = "Gamma (30-100 Hz)">
            <Text>These fast (ie. high frequency) waves have been associated with concentration, alertness, working memory, and attention.
            </Text>
          </ListItemBlock>
    */

class SlideEleven extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUp1Visible: false,
      popUp2Visible: false,
    };

  }

  render() {
    return (
      <View style={styles.container}>

      <View style={styles.graphContainer}>
        <Text>PSD Curve with drawn boundaries for different regions</Text>
      </View>

      <ViewPagerAndroid //Allows us to swipe between blocks
        style={styles.viewPager}
        initialPage={0}>

        <View style={styles.pageStyle}>
          <Text style={styles.header}>What do these frequency bands represent?</Text>
          <Text style={styles.body}> The waves extracted from the EEG can be grouped into 5 different
            <PopUpLink onPress={() => this.setState({popUp1Visible: true})}> frequency bands, </PopUpLink>
            corresponding to different brain processes.
          </Text>
        </View>

        <View style={styles.pageStyle}>
          <Text style={styles.body}> Notice how the power in a given frequency band changes over time with your brain state. As we will see next, we can use these feature changes to make a simple
            <PopUpLink onPress={() => this.setState({popUp2Visible: true})}>  Brain-Computer Interface (BCI).</PopUpLink>
          </Text>
          <Button onPress={Actions.End}>Next</Button>
        </View>


      </ViewPagerAndroid>

        <PopUpList onClose={() => this.setState({popUp1Visible: false})} visible={this.state.popUp1Visible}>
          <ListItemBlock title = "Delta (0-4 Hz)">
            <Text>Delta waves are the slowest (ie. lowest frequency) waves. Delta waves dominate during sleep tend to be high in amplitude because they represent the synchronized firing of large populations of neurons.
            </Text>
          </ListItemBlock>
          <ListItemBlock title = "Theta (4-8 Hz)">
            <Text>Theta waves have been observed in the period just before falling asleep. They have also been observed during deep meditative and hypnotic states.
            </Text>
          </ListItemBlock>
          <ListItemBlock title = "Alpha (8-13 Hz)">
            <Text>Alpha waves can indicate the idling of a brain regions. For example, they increase dramatically when the eyes are closed. They are especially strong at the back of the head, where the vision center of the brain is located.
            </Text>
          </ListItemBlock>
          <ListItemBlock title = "Beta (13-30 Hz)">
            <Text>Beta waves are prevalent when the brain is awake and active. They have been associated with alertness and concentration. 
            </Text>
          </ListItemBlock>
        </PopUpList>

        <PopUp onClose={() => this.setState({popUp2Visible: false})} visible={this.state.popUp2Visible}>
A Brain-Computer Interface is a direct communication channel between the brain and an external device. For example, one can feed information about the brain state (using EEG) to a computer; that computer then analyzes the EEG data and decides what the user intent was. The computer can finally control an external device - such as a wheelchair or a display - based on that decision.
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

export default connect(({route}) => ({route}))(SlideEleven);