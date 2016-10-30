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

import WhiteButton from '../components/WhiteButton';


class End extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Image source={require('../assets/clouds.png')} style={styles.container} resizeMode='stretch'>
      
        <View style={styles.titleBox}>
          <Text style={styles.title}> Thanks for completing {"\n"} EEG 101</Text>
          <Text style={styles.body}> We hope you enjoyed the tutorial. Join our Slack at NeuroTechX.com to learn more or get involved!</Text>      
        </View>

        <View style={styles.ntxBox}>
          <Image source={require('../assets/ntx.png')} resizeMode='contain'
          style={{height:80, width:100}}/>
          <Text style={{fontFamily: 'Roboto-Bold', width: 150, color: 'white'}}>The International Neurotechnology Network</Text>
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

        <View style={{flex: 1, margin: 15}}>
          <WhiteButton onPress={Actions.SlideOne}>BACK TO BEGINNING</WhiteButton>
        </View>
            
      </Image>
    );
  }
}

const styles = StyleSheet.create({

body: {
    fontFamily: 'Roboto-Light',
    fontSize: 13,
    color: '#ffffff',
    textAlign: 'center'
  },

  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
    width: null,
    height: null,
    backgroundColor: 'rgba(0,0,0,0)' 
},

  header: {
    fontFamily: 'Roboto-Bold',
    color: '#ffffff',
    fontSize: 20,
  },


  textbox: {
    flex: 2,
    margin: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  ntxBox: {
    marginLeft: 60,
    marginRight: 60,
    flex: 1.5,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',

  },


  title: {
    textAlign: 'center',
    margin: 15,
    lineHeight: 50,
    color: '#ffffff',
    fontFamily: 'Roboto-Black',
    fontSize: 30,
      },

  titleBox: {
    marginTop: 40,
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
      },


});

export default connect(({route}) => ({route}))(End);