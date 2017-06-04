import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  Image
} from 'react-native';
import{
  Actions,
}from 'react-native-router-flux';
import Animation from 'lottie-react-native';

import { connect } from 'react-redux';
import { MediaQueryStyleSheet }  from 'react-native-responsive';
import LinkButton from '../components/LinkButton';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {
      dimensions: state.graphViewDimensions,
    };
  }

class SlideFive extends Component {
  constructor(props) {
    super(props);

      // Initialize States
    this.state = {
      popUpVisible: false,
    }
  }

  componentDidMount() {
    this.animation.play();
  }

  loopAnimation() {
    Animated.sequence([
      Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 10000,
    }),
      Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 10000,
      })]).start(event => {
        if (event.finished) {
          this.loopAnimation();
        }
    });
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.graphContainer}>
          <Animation
            ref={animation => {this.animation = animation; }}
            style={{height: this.props.dimensions.height,
            width: this.props.dimensions.width}}
            source="epoching.json"
            loop={true}
          />
          </View>

          <Text style={styles.currentTitle}>EPOCHING</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Chunking the signal</Text>
            <Text style={styles.body}>Next, the EEG is divided into small segments or <PopUpLink onPress={() => this.setState({popUpVisible: true})}>'epochs.'</PopUpLink>

            </Text>
            <LinkButton path='/slideSix'> NEXT </LinkButton>
          </View>

        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUpVisible: false})} visible={this.state.popUpVisible}
        title='Epochs'>The brain is constantly changing and the EEG changes with it. Dividing the EEG into epochs allows each moment in time to be analyzed individually. Analyzing how the properties of these epochs vary allows us to quantify how the brain changes over time.
        </PopUp>



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
      backgroundColor: 'white',
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



export default connect(mapStateToProps)(SlideFive);
