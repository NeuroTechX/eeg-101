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
import { MediaQueryStyleSheet} from 'react-native-responsive';
import Button from './Button';
import I18n from '../i18n/i18n';

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
            <Text style={styles.modalTitle}>{this.props.title}</Text>
            {this.props.children}
            <Button onPress={this.props.onClose}>{I18n.t('closeButton')}</Button>
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      padding: 20,
      backgroundColor: 'rgba(12, 89, 128, 0.8)',
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

    close: {
      alignSelf: 'center',
      padding: 20,
      fontSize: 22,
    },

  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      modalBackground: {
        paddingTop: 100,
        backgroundColor: 'rgba(12, 89, 128, 0.25)',
      },
    },
    "@media (min-device-height: 1000)": {
      modalBackground: {
        paddingTop: 200,
        backgroundColor: 'rgba(12, 89, 128, 0.25)',
      },
    }
  });
