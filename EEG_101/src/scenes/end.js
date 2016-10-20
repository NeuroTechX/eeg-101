import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
} from 'react-native';

import{
  Actions,
}from 'react-native-router-flux';
import { connect } from 'react-redux';

import Button from '../components/Button';


class End extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
      <View style={{flexDirection: 'row', backgroundColor: 'black', justifyContent: 'center', alignItems:'center',}}>
          <Image source={require('../assets/ntx.png')} resizeMode='contain'
          style={{height:80, width:100}}/>
          <Text style={{fontFamily: 'Roboto-Bold', width: 150, color: 'white'}}>The International Neurotechnology Network</Text>
        </View>
        <View style={styles.titleBox}>
          <Text style={styles.title}> Thanks for completing EEG 101</Text>
          <Text style={styles.body}>We hope you enjoyed this tutorial. Get in touch with us @ NeurotechX.com if you want to get involved!</Text>       
        </View>
        
        <View style={styles.textbox}>
          <Text style={styles.header}>What's Next?</Text>
          <Text style={styles.body}>1. High/Low Pass Filtering</Text>
          <Text style={styles.body}>2. Artifact Removal</Text>
          <Text style={styles.body}>3. Feature Extraction</Text>
          <Text style={styles.body}>4. Brain Waves</Text>
          <Text style={styles.body}>5. Brain Computer Interfaces</Text>
          <Text style={styles.body}>6. Machine Learning</Text>
        </View>
          <Button onPress={Actions.SlideOne}>BACK TO BEGINNING</Button>       
      </View>
    );
  }
}

const styles = StyleSheet.create({

body: {
    fontFamily: 'Roboto-Light',
    fontSize: 16,
    color: '#4AB4E3',
    textAlign: 'center'
  },


  container: {
    marginTop:55,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
},

  header: {
    fontFamily: 'Roboto-Bold',
    color: '#484848',
    fontSize: 20,
  },


  textbox: {
    flex: 3,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },


  title: {
    textAlign: 'center',
    color: '#4AB4E3',
    fontFamily: 'Roboto-Light',
    fontSize: 30,
      },


});

export default connect(({route}) => ({route}))(End);