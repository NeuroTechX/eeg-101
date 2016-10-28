import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image
} from 'react-native';
import EEG_GRAPH from '../interface/GraphView';
import{
  Actions,
}from 'react-native-router-flux';


export default class SlideEleven extends Component {
  constructor(props) {
    super(props);

      // Initialize States
    this.state = {modalVisible: false};
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={styles.container}>
      <View style={styles.titlebox}>
        <Image source={require('../assets/eeg101logo.gif')}/>
        <Text style = {styles.title}> Thanks for completing EEG 101!</Text>
        <Text style = {styles.body}>If this app was educational or entertaining in any way, we are satisfied. Please get in touch with us @ NeurotechX.com to give us feedback!</Text>
       </View>
        
        <View style={styles.textbox}>
          <Text style={styles.header}>What's Next?</Text>
          <Text style{styles.body}>Eventually, this app will teach you about Brain Computer Interfaces (BCIs) and guide you through the process of training your own BCI.</Text>
        </View>

        <View style={styles.button}>
          <Text onPress={Actions.Landing}>Go back to the beginning</Text>
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 52,
  },

  graphContainer: {
    backgroundColor: '#66ccff',
    width: 800,
    flex: .5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headDiagram: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },

  textbox: {
    flex: .5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalInnerContainer: {
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },

  modal: {
    flex: .25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  title: {
    flex: 1,
    color:'#004080',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 50,
      },

  header: {
    flex: .15,
    fontSize: 25,
    marginTop: 20,
  },

  body: {
    flex: .5,
    fontSize: 18,
    marginLeft: 20,
    marginRight: 20, 
  }, 

  picker: {
    width: 150,
    color: '#383838', 
  },

  connector: {
    flex: .25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    flex: .15,
    justifyContent: 'center',
    backgroundColor: '#99ccff',
    width: 800,
    borderWidth: 1,
    alignItems: 'center',
  }  
});
