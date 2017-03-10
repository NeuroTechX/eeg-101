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
import { MediaQueryStyleSheet }  from 'react-native-responsive';
import config from '../redux/config'
import WhiteButton from '../components/WhiteButton';
import ConnectorWidget from '../components/ConnectorWidget';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {isVisible: state.scene.sceneKey === 'ConnectorTwo',
      connectionStatus: state.connectionStatus,
    };
  }

 class ConnectorTwo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Step 2</Text>
          <Text style={styles.instructions}>Wait for your Muse to pair {"\n"} with EEG 101</Text>
        </View>
        <ConnectorWidget/>
        <View style={styles.buttonContainer}>
          <WhiteButton onPress={Actions.ConnectorThree} disabled={!(this.props.connectionStatus === config.connectionStatus.CONNECTED)}>LET'S GET STARTED</WhiteButton>
        </View>
      </View>
    );
  }
}
export default connect(mapStateToProps)(ConnectorTwo);

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
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
      },

      instructions: {
        fontSize: 30
      },
    }
  }
);