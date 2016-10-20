// PopUp.js
// A popup modal containing extra info
import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import Button from '../components/Button';



export default class PopUp extends Component{
  
  render() {
    return(
      <Modal
          animationType={"fade"}
          transparent={true}
          onRequestClose={this.props.onClose}
          visible={this.props.visible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalInnerContainer}>
            <Text style={styles.modalText}> {this.props.children} </Text>
              <Button onPress={this.props.onClose}>Close</Button>
          </View>   
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
 
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalText: {
    fontFamily: 'Roboto-Light',
    color: '#72C2F1',
    fontSize: 15,
    margin: 5,
  },

  modalInnerContainer: {
    borderRadius: 10,
    alignItems: 'stretch',
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

  close: {
    fontSize: 22,
  },

});

