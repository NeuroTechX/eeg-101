import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  Image,
} from 'react-native';
import{
  Actions,
  ActionConst,
}from 'react-native-router-flux';
import { connect } from 'react-redux';
import config from '../redux/config';
import { MediaQueryStyleSheet }  from 'react-native-responsive';
import LinkButton from '../components/LinkButton';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
    return {
      connectionStatus: state.connectionStatus,
    };
  }

class SlideTwo extends Component {
  constructor(props) {
    super(props);
    isVisible: true;

      // Initialize States
    this.state = {
      popUp1Visible: false,
      popUp2Visible: false,
      popUp3Visible: false,
      slidePosition: 0,
    }
  }

  componentWillUnmount () {
    console.log("componentWillUnmount called.  Location is " + this.props.location.pathname);
  }

  componentDidMount () {
    console.log("componentDidMount called. Location is " + this.props.location.pathname);
  }

  render() {
    // Sets the source of the lesson image based on the position of the ViewPager
    const imageSource = ((slidePosition) => {switch(slidePosition) {
      case 0:
        return require('../assets/neuronarrow.png');
        break;
      case 1:
        return require('../assets/neuronmultiarrow.png');
        break;
      case 2:
        return require('../assets/awakeasleep.gif');
        break;
    }});
    return (
      <View style={styles.container}>

        <View style={styles.graphContainer}>
          <Image source={imageSource(this.state.slidePosition)}
                style={styles.image}
                resizeMode='contain'/>
        </View>

        <Text style={styles.currentTitle}>PHYSIOLOGY</Text>

        <ViewPagerAndroid // Allows us to swipe between child views
          style={styles.viewPager}
          initialPage={0}
          // Receives a native callback event e that is used to set slidePosition state
          onPageSelected={(e) => this.setState({slidePosition: e.nativeEvent.position})}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Where does the EEG signal come from?</Text>
            <Text style={styles.body}>The EEG measures the electrical activity that occurs when <PopUpLink onPress={() => this.setState({popUp1Visible: true})}>neurons</PopUpLink> receive and transmit information.
            </Text>
          </View>

          <View style={styles.pageStyle}>
          <Text style={styles.header}>Organized neural activity produces electric fields</Text>
            <Text style={styles.body}>When billions of neurons <PopUpLink onPress={() => this.setState({popUp2Visible: true})}>work together</PopUpLink> to produce thoughts, feelings, and behaviours, their electricity can be detected by electrodes on the scalp.
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>EEG detects the "state" of the brain</Text>
            <Text style={styles.body}>This organized electrical activity varies between different brain states, such as <PopUpLink onPress={() => this.setState({popUp3Visible: true})}>sleep and wakefulness.</PopUpLink>
            </Text>
            <LinkButton path='/slideThree'> NEXT </LinkButton>
          </View>
        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUp1Visible: false})} visible={this.state.popUp1Visible}
        title='Neural basis of EEG'>
          When synapses are activated on a neuron's dendrites, a small electric field (dipole) is created along the body of the neuron due to the difference in charge between those dendrites and the axon. This electric field only lasts for a few milliseconds.
        </PopUp>

        <PopUp onClose={() => this.setState({popUp2Visible: false})} visible={this.state.popUp2Visible}
        title='Neural basis of EEG'>
          The electric fields produced by single neurons are vanishingly small. However, when large numbers of cortical neurons fire rhythmically, their activity can produce electric fields that are large enough to cross the surface of the skull. This process is influenced by many factors, including depth, orientation, and subtype of neurons, and is a topic of ongoing research.
        </PopUp>

        <PopUp onClose={() => this.setState({popUp3Visible: false})} visible={this.state.popUp3Visible}
        title='Brain states'>
          During sleep our brains produce very different kinds of rhythmic electrical activity. When awake, brain rhythms tend to be rapidly-changing and irregular, while slowly-changing, organized rhythms become more dominant as we fall asleep and pass through the multiple sleep stages. {"\n"}Certain emotions and cognitive processes have also been linked with characteristic patterns of rhythmic activity that can be identified with EEG.
        </PopUp>

       <PopUp onClose={Actions.ConnectorOne} visible={this.props.connectionStatus === config.connectionStatus.DISCONNECTED} title='Muse Disconnected'>
        Please reconnect to continue the tutorial</PopUp>

      </View>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
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
      marginTop:55,
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
  });

export default connect(mapStateToProps)(SlideTwo);
