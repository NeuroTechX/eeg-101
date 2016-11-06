// PopUp.js
// A popup modal containing extra info. 
// Can accept a title prop that will be display as header text at top of the popup text
// Image source passed as image prop will be displayed in black region at the top of the popup
// onClose is called when the Close button is clicked. Must be an arrow function that changes an isVisible prop in the parent component to false
// visible must be a boolean state in the parent component

import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import Button from '../components/Button';



export default class PopUp extends Component{
  
  render() {
    let imageStyle = (this.props.image != null) ? styles.activeImage: styles.disabledImage
    return(
      <Modal
          animationType={"fade"}
          transparent={true}
          onRequestClose={this.props.onClose}
          visible={this.props.visible}>
        <View style={styles.modalBackground}>
        <View style={{backgroundColor: '#1B1B1B'}}>
            <Image source={this.props.image} style={imageStyle} resizeMode='contain'/>
            </View>
          <View style={styles.modalInnerContainer}>
            
            <Text style={styles.modalTitle}> {this.props.title} </Text>
            
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
    backgroundColor: 'rgba(12, 89, 128, 0.8)',
  },

  modalText: {
    fontFamily: 'Roboto-Light',
    color: '#484848',
    fontSize: 15,
    margin: 5,
  },

  modalTitle: {
    fontFamily: 'Roboto-Bold',
    color: '#484848',
    fontSize: 20,
    margin: 5,
  },

  modalInnerContainer: {
    
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

  activeImage: {
    alignSelf: 'center',
    height: 150,
    width: 150,
    margin: 10,

  },

  disabledImage: {
    height: 0,
    width: 0,
  },

  close: {
    fontSize: 22,
  },

});

