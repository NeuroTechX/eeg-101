import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  Image
} from 'react-native';
import{
  Actions,
}from 'react-native-router-flux';
import { connect } from 'react-redux';
import { MediaQueryStyleSheet }  from 'react-native-responsive';
import LinkButton from '../components/LinkButton';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {isVisible: state.scene.sceneKey === 'SlideSix'};
  }

class SlideSix extends Component {
  constructor(props) {
    super(props);

      // Initialize States
    this.state = {
      popUpVisible: false,
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.graphContainer}>
          <Image source={require('../assets/artifact.png')}
                style={styles.image}
                resizeMode='contain'/>
        </View>

        <Text style={styles.currentTitle}>ARTIFACT REMOVAL</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>


          <View style={styles.pageStyle}>
            <Text style={styles.header}>Removing noise</Text>
            <Text style={styles.body}>After the EEG has been divided into epochs, those that contain a <PopUpLink onPress={() => this.setState({popUpVisible: true})}>significant</PopUpLink> amount of noise can be ignored.
            </Text>
            <LinkButton path='/slideSeven'> NEXT </LinkButton>
          </View>

        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUpVisible: false})} visible={this.state.popUpVisible}
        title="Artefact detection">One simple way to define what a 'significant amount of noise' is to compare how variable an epoch is in comparison to its neighbours. If the signal moves around in one epoch a lot more than in its neighbours, it is probably because there was an eyeblink or some other source of noise. Get rid of it!</PopUp>



      </View>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    currentTitle: {
      marginLeft: 20,
      marginTop: 10,
      fontSize: 13,
      fontFamily: 'Roboto-Medium',
      color: '#6CCBEF',
    },

    body: {
      fontFamily: 'Roboto-Light',
      color: '#484848',
      fontSize: 19,
    },

    container: {
      marginTop: 55,
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'stretch',
    },

    graphContainer: {
      backgroundColor: '#72c2f1',
      flex: 4,
      justifyContent: 'center',
      alignItems: 'stretch',
    },

    header: {
      fontFamily: 'Roboto-Bold',
      color: '#484848',
      fontSize: 20,
    },


    viewPager: {
      flex: 4,
    },

    pageStyle: {
      padding: 20,
      alignItems: 'stretch',
      justifyContent: 'space-around',
    },

    image: {
      flex: 1,
      width: null,
      height: null,
    },
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {

      viewPager: {
        flex: 3,
      },

      header: {
        fontSize: 30,
      },

      currentTitle: {
        fontSize: 20,
      },

      body: {
        fontSize: 25,
      }
    }
  }
);
export default connect(mapStateToProps)(SlideSix);
