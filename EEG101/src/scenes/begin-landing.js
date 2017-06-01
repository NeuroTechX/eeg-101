import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Picker,
  Image,
} from 'react-native';
import{
  Actions,
}from 'react-native-router-flux';
import { Link } from 'react-router-native';
import { connect } from 'react-redux';
import { MediaQueryStyleSheet } from 'react-native-responsive';
import LinkButton from '../components/WhiteLinkButton';

// Sets isVisible prop by comparing state.scene.key (active scene) to this scene's ley
function  mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
  };
}

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
    };
  }


  render() {
    return (
      <Image source={require('../assets/clouds.png')} style={styles.container} resizeMode='stretch'>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Welcome to EEG 101</Text>
          <Text style={styles.body}>At the end of this tutorial, you will have learned how EEG devices can be used to measure the electrical activity of the brain.</Text>
        </View>
        <View style={styles.buttonContainer}>
          <LinkButton path='/connectorOne'> GET STARTED </LinkButton>
        </View>
      </Image>
    );
  }

}
export default connect(mapStateToProps)(Landing);

const styles = MediaQueryStyleSheet.create(
  {
    // Base styles
    body: {
      fontFamily: 'Roboto-Light',
      fontSize: 15,
      margin: 20,
      color: '#ffffff',
      textAlign: 'center'
    },

    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      width: null,
      height: null,
      backgroundColor: 'rgba(0,0,0,0)'
    },

    buttonContainer: {
      flex: 1,
      margin: 40,
      justifyContent: 'center',
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
      flex: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      body: {
        fontSize: 20,
        marginLeft: 50,
        marginRight: 50
      }
    }
  });
