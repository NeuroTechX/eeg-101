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
    return {isVisible: state.scene.sceneKey === 'Landing',
      connectionStatus: state.connectionStatus,
    };
  }

 class Landing extends Component {
  constructor(props) {
    super(props);
    isVisible = true;

    // Initialize States
    this.state = {
      
    };
    // <WhiteButton onPress={Actions.SlideOne} disabled={!(this.props.connectionStatus === config.connectionStatus.CONNECTED)}>BEGIN</WhiteButton>
  }

  render() {
    return (
      <Image source={require('../assets/clouds.png')} style={styles.container} resizeMode='stretch'>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Welcome to EEG 101</Text>
          <Text style={styles.body}>At the end of this tutorial, you will have learned how EEG devices can be used to measure the electrical activity of the brain.</Text>
        </View>
        <View style={{flex: 1, margin: 40}}>
          <WhiteButton onPress={Actions.ConnectorOne}>GET STARTED</WhiteButton>
        </View>
      </Image>
    );
  }

}
export default connect(mapStateToProps)(Landing);

const styles = StyleSheet.create({

body: {
    fontFamily: 'Roboto-Light',
    fontSize: 15,
    margin: 20,
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