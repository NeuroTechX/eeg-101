import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { MediaQueryStyleSheet} from 'react-native-responsive';

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

        <ViewPagerAndroid //Allows us to swipe between blocks
          initialPage={0} style={{flex:8}}>
          <View style={styles.page}>
            <View style={styles.titleBox}>
              <Text style={styles.title}> Thanks for completing {"\n"} EEG 101</Text>
              <Text style={[styles.body, {margin: 10}]}> We hope you enjoyed learning about the basics of EEG. Soon, this tutorial will cover more advanced topics, such as how to create a simple brain-machine interface!</Text>      
            </View>

            <View style={styles.listBox}>
              <Text style={styles.header}>What's Next?</Text>
              <Text style={styles.body}>1. Interactive Brain Computer Interface</Text>
              <Text style={styles.body}>2. Band-Pass Filtering</Text>
              <Text style={styles.body}>3. Live Artifact Removal</Text>
              <Text style={styles.body}>4. Machine Learning!</Text>
            </View>

            <View style={{marginBottom: 20}}>
            <Image source={require('../assets/swipeiconwhite.png')} resizeMode='contain' style={styles.swipeImage}/>
            </View>

          </View>

          <View style={styles.page}>
            <View style={styles.titleBox}>
              <Text style={styles.header}>This project is Open Source</Text>
              <Text style={styles.body}>EEG101 is the result of a collaboration between NeuroTechX, the international neurotechnology network, and the developers at KBDGroup. Its source code is open for anyone to use or contribute to.</Text>
              <View style={styles.textBox}>
                <Text style={styles.body}>Interested in how an EEG app is built? Want to contribute to this project? Check out the repo on Github and our community on Slack</Text>
              </View>
            </View>

            <View style={styles.logoBox}>
              <TouchableOpacity onPress={() => {Linking.openURL('http://neurotechx.com/')}}>
                <Image source={require('../assets/ntx.png')} resizeMode='contain' style={styles.logo}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {Linking.openURL('http://www.kbdgroup.ca/index.html')}}>
                <Image source={require('../assets/kbdlogo.png')} resizeMode='contain' style={styles.logo}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {Linking.openURL('https://github.com/NeuroTechX/eeg-101')}}>
                <Image source={require('../assets/gitlogo.png')} resizeMode='contain' style={styles.logo}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {Linking.openURL('https://neurotechx.herokuapp.com/')}}>
                <Image source={require('../assets/slacklogowhite.png')} resizeMode='contain' style={styles.logo}/>
              </TouchableOpacity>
            </View>

            <View style={{marginBottom: 20}}>
              <Image source={require('../assets/swipeiconwhite.png')} resizeMode='contain' style={styles.swipeImage}/>
            </View>

          </View>

          <View style={styles.page}>

            <View style={[styles.listBox, {marginTop: 100}]}>
              <Text style={styles.header}>The EEG 101 Team</Text>
              <Text style={styles.body}>Hubert Banville - Visionary</Text>
              <Text style={styles.body}>Dano Morrison - Developer</Text>
              <Text style={styles.body}>Geordan King - Producer</Text>
              <Text style={styles.body}>Michael Vu - Author</Text>
              <Text style={styles.body}>Joanna Jang - Author</Text>
              <Text style={styles.body}>Brian Stern - Software Architect</Text>
              <Text style={styles.body}>Steve Harjula - Visual Design</Text>
              <Text style={styles.body}>Miles McCraw - Animator</Text>
            </View>

            <View style={styles.buttonBox}>
              <WhiteButton onPress={Actions.ConnectorThree}>BACK TO BEGINNING</WhiteButton>
            </View>
          </View>
          
        </ViewPagerAndroid>

      </Image>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
  body: {
      fontFamily: 'Roboto-Light',
      fontSize: 17,
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
      marginTop: -20,
      marginBottom: 40,
      opacity: 1,
      flex: .75,
      backgroundColor: 'black',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },

    logo: {
      width: 60,
      height: 40,
    },

    title: {
      textAlign: 'center',
      marginTop: 15,
      lineHeight: 50,
      color: '#ffffff',
      fontFamily: 'Roboto-Black',
      fontSize: 30,
      },

    titleBox: {
      marginTop: 40,
      flex: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },

    swipeImage: {
      height: 40,
      width: 40,
    },

    page: {
      flex: 1,
      alignItems: 'center',
      marginBottom: 15,
    },

    buttonBox: {
      alignSelf: 'stretch',
      alignItems: 'stretch',
      margin: 20,
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      header: {
        fontSize: 30,
      },

      body: {
        paddingLeft: 50,
        paddingRight: 50,
        fontSize: 20,
      },

      swipeImage: {
        margin: 50,
        height: 75,
        width: 75,
      },

      logo: {
        width: 120,
        height: 90,
      },

      buttonBox: {
        padding: 20,
      }
    }
  });

export default connect(({route}) => ({route}))(End);