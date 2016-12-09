// PopUpList.js
// A popup modal that has a ScrollView for displaying large amounts of text

import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Button from './Button';


export default class PopUpList extends Component{
  
  render() {
    return(
      <Modal
          animationType={"fade"}
          transparent={true}
          onRequestClose={this.props.onClose}
          visible={this.props.visible}>
        <View style={styles.modalBackground}>
          <ScrollView contentContainerStyle={styles.modalInnerContainer}>
            {this.props.children}
            <Button onPress={this.props.onClose}>Close</Button>
          </ScrollView>   
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
    backgroundColor: 'rgba(12, 89, 128, 0.8)',
  },

  modalInnerContainer: {
    alignItems: 'stretch',
    backgroundColor: 'white',
    padding: 20,
  },

  close: {
    alignSelf: 'center',
    padding: 20,
    fontSize: 22,
  },

});

