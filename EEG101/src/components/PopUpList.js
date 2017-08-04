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
import * as colors from "../styles/colors";

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
      backgroundColor: colors.modalBlue,
    },

    modalTitle: {
      fontFamily: 'Roboto-Bold',
      color: colors.black,
      fontSize: 20,
      margin: 5,
    },

    modalInnerContainer: {
      alignItems: 'stretch',
      backgroundColor: colors.white,
      padding: 20,
      elevation: 4,
      borderRadius: 4,
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
        backgroundColor: colors.modalTransparent,
      },
    },
    "@media (min-device-height: 1000)": {
      modalBackground: {
        paddingTop: 200,
        backgroundColor: colors.modalTransparent,
      },
    }
  });
