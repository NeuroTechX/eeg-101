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

// Components. For JS UI elements
import Button from '../components/Button';
import ConnectorWidget from '../components/ConnectorWidget';
import ElectrodeSelector from '../components/ElectrodeSelector';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {isVisible: state.scene.sceneKey === 'Landing'};
  }

 class Landing extends Component {
  constructor(props) {
    super(props);
    isVisible = true;

    // Initialize States
    this.state = {
      startButtonDisabled: true
    };
  }

  // Picker function that changes the selectedValue state
  onValueChange(key, value) {
      this.setState({
          selectedValue : key,
      });
    }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Welcome to EEG 101</Text>
          <Text style={styles.body}>At the end of this tutorial, you will have learned how EEG devices can be used to measure the electrical activity of the brain.</Text>
        </View>
        <ConnectorWidget  enableStartButton={(bool) => this.setState({startButtonDisabled: bool})}/>
        <Button onPress={Actions.SlideOne} disabled={this.state.startButtonDisabled}>BEGIN</Button>
      </View>
    );
  }

}
export default connect(mapStateToProps)(Landing);

const styles = StyleSheet.create({

body: {
    fontFamily: 'Robot-Regular',
    fontSize: 16,
    margin: 20,
    color: '#4AB4E3',
    textAlign: 'center'
  },

  container: {
    marginTop: 15,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
},

  logo: {
    width: 50,
    height: 50,
  },

  title: {
    textAlign: 'center',
    margin: 50,
    lineHeight: 50,
    color: '#4AB4E3',
    fontFamily: 'Roboto-Light',
    fontSize: 40,
      },

  titleBox: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
      },
});