import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  Image,
} from 'react-native';
import{
  Actions,
}from 'react-native-router-flux';
import { connect } from 'react-redux';

import config from '../../config'

// Components. For JS UI elements
import WhiteButton from '../components/WhiteButton';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {isVisible: state.scene.sceneKey === 'ConnectorTwo',
      connectionStatus: state.connectionStatus,
    };
  }

 class ConnectorThree extends Component {
  constructor(props) {
    super(props);
    isVisible = true;

    // Initialize States
    this.state = {
      
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Step 3</Text>
          <Text style={styles.instructions}>Make sure Muse is fit to your head properly</Text>
          <Text style={styles.body}>Fit the earpieces snugly behind your ears and adjust the headband so it sits mid forehead. Clear any hair between the device and your head</Text>
        </View>
        
        <View style={{flex: 1, margin: 40}}>
          <WhiteButton onPress={Actions.SlideOne}>BEGIN</WhiteButton>
        </View>
      </View>
    );
  }
}
export default connect(mapStateToProps)(ConnectorThree);

const styles = StyleSheet.create({

body: {
    fontFamily: 'Roboto-Light',
    fontSize: 15,
    margin: 20,
    color: '#ffffff',
    textAlign: 'center'
  },

instructions: {
  fontFamily: 'Roboto-Bold',
  fontSize: 18,
  margin: 20,
  color: '#ffffff',
  textAlign: 'center',
},

  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
    width: null,
    height: null,
    backgroundColor: '#6CCBEF', 
},

  logo: {
    width: 50,
    height: 50,
  },

  title: {
    textAlign: 'center',
    margin: 15,
    lineHeight: 50,
    color: '#ffffff',
    fontFamily: 'Roboto-Black',
    fontSize: 48,
      },

  titleBox: {
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center',
      },
});