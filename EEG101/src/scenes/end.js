import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ViewPagerAndroid,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';

import{
  Actions,
  ActionConst,
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

        <ViewPagerAndroid //Allows us to swipe between blocks
          initialPage={0} style={{flex:8}}>
          <View>
            <View style={styles.titleBox}>
              <Text style={styles.title}> Thanks for completing {"\n"} EEG 101</Text>
              <Text style={styles.body}> We hope you enjoyed learning about the basics of EEG. Soon, this tutorial will cover more advanced aspects of processing and working with EEG, including how it can be used to create a simple brain-machine interface!</Text>      
            </View>

            <View style={styles.listBox}>
              <Text style={styles.header}>What's Next?</Text>
              <Text style={styles.body}>1. High/Low Pass Filtering</Text>
              <Text style={styles.body}>2. Artifact Removal</Text>
              <Text style={styles.body}>3. Feature Extraction</Text>
              <Text style={styles.body}>4. Brain Waves</Text>
              <Text style={styles.body}>5. Brain Computer Interfaces</Text>
              <Text style={styles.body}>6. Machine Learning</Text>
            </View>
          </View>

          <View style={{alignItems: 'center'}}>
            <View style={styles.titleBox}>
              <Text style={styles.header}>This project is Open Source</Text>
              <Text style={styles.body}>EEG101 is the result of a collaboration between NeuroTechX, the international neurotechnology network, and the developers at KBDGroup. Its source code is open for anyone to use or contribute to.</Text>
              <View style={styles.textBox}>
              <Text style={styles.body}>Interested in how an EEG app is built? Have your own experience you'd like to share with the project? Check out the project repo on Github and our community on Slack</Text>
              </View>
            </View>

            
              <View style={styles.logoBox}>
                <TouchableOpacity onPress={() => {Linking.openURL('http://neurotechx.com/')}}>
                  <Image source={require('../assets/ntx.png')} resizeMode='contain' style={{height:50, width:60}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {Linking.openURL('http://www.kbdgroup.ca/index.html')}}>
                  <Image source={require('../assets/kbdlogo.png')} resizeMode='contain' style={{height:40, width:60}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {Linking.openURL('https://github.com/NeuroTechX/eeg-101')}}>
                  <Image source={require('../assets/gitlogo.png')} resizeMode='contain' style={{height:40, width:60}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {Linking.openURL('https://neurotechx.herokuapp.com/')}}>
                  <Image source={require('../assets/slacklogowhite.png')} resizeMode='contain' style={{height:60, width:60}}/>
                </TouchableOpacity>
              </View>
            
          </View>
          
        </ViewPagerAndroid>
        <View style={{flex: 1, margin: 15}}>
              <WhiteButton onPress={Actions.ConnectorThree}>BACK TO BEGINNING</WhiteButton>
            </View>
      </Image>
    );
  }
}

const styles = StyleSheet.create({

body: {
    fontFamily: 'Roboto-Light',
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
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
    margin: 15,
  },


  textBox: {
    margin: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  listBox: {
    flex: 3,
    margin: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  logoBox: {
    borderRadius: 20,
    opacity: 1,
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
      },


});

export default connect(({route}) => ({route}))(End);