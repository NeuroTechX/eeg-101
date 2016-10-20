// PopUpList.js
// A popup modal containing extra info w/ no text commitment
import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';


export default class PopUpList extends Component{
  
  render() {
    return(
      <Modal
          animationType={"fade"}
          transparent={true}
          onRequestClose={this.props.onClose}
          visible={this.props.visible}>
        <View style={styles.modalBackground}>
          <ScrollView style={styles.modalInnerContainer}>
            {this.props.children}
            <TouchableOpacity onPress={this.props.onClose}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
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

  close: {
    alignSelf: 'center',
    padding: 20,
    fontSize: 22,
  },

});

