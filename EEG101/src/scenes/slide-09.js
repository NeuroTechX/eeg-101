import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { MediaQueryStyleSheet }  from 'react-native-responsive';
import LinkButton from '../components/LinkButton';
import config from '../redux/config';
import PopUp from '../components/PopUp';
import PopUpList from '../components/PopUpList';
import ListItemBlock from '../components/ListItemBlock';
import PopUpLink from '../components/PopUpLink';

//Interfaces. For elements that bridge to native
import WaveGraphView from '../interface/WaveGraphView';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
  return {
    dimensions: state.graphViewDimensions,
    connectionStatus: state.connectionStatus,
  };
}

class SlideNine extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      channelOfInterest: 1,
      popUp1Visible: false,
      popUp2Visible: false,
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <WaveGraphView dimensions={this.props.dimensions} />

        <Text style={styles.currentTitle}>BRAIN WAVES</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>What do these frequencies represent?</Text>
            <Text style={styles.body}>The PSD can be divided into different frequency bands (named by the greek letters δ, θ, α, β, and γ).
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Brain Waves</Text>
            <Text style={styles.body}>Each frequency band exhibits activity correlated with different brain processes. These bands are often referred to as <PopUpLink onPress={() => this.setState({popUp1Visible: true})}>brain waves</PopUpLink>.
            </Text>
          </View>

          <View style={styles.pageStyle}>
            <Text style={styles.header}>Harnessing Brain Waves</Text>
            <Text style={styles.body}>Notice how the power in a given frequency band changes over time. It is possible to harness these changes to create a simple <PopUpLink onPress={() => this.setState({popUp2Visible: true})}>Brain-Computer Interface (BCI)</PopUpLink>.
            </Text>
            <LinkButton path='/sandbox'> NEXT </LinkButton>
          </View>

        </ViewPagerAndroid>

        <PopUpList onClose={() => this.setState({popUp1Visible: false})} visible={this.state.popUp1Visible}>
          <ListItemBlock title = "Delta δ (0-4 Hz)">
            Delta waves are the slowest (i.e. lowest frequency) brain waves. Delta waves dominate during deep sleep and tend to be high in amplitude because they represent the synchronized firing of large populations of neurons.
          </ListItemBlock>
          <ListItemBlock title = "Theta θ (4-8 Hz)">
            Theta waves are most commonly observed in the 'hypnagogic' period just before falling asleep. They have also been observed during deep meditative and hypnotic states.
          </ListItemBlock>
          <ListItemBlock title = "Alpha α (8-13 Hz)">
            Alpha waves can indicate the idling of a brain region. For example, they increase dramatically at when the eyes are closed. They are especially strong at the back of the head, where the vision centre of the brain is located.
          </ListItemBlock>
          <ListItemBlock title = "Beta β (13-30 Hz)">
            Beta waves are prevalent when the brain is awake and active. They have been associated with alertness, concentration, and the active firing of neurons hard at work.
          </ListItemBlock>
          <ListItemBlock title = "Gamma γ (30-100 Hz)">
            Gamma waves are the fastest form of neural oscillation. They are difficult to detect and analyze with ordinary EEG but are a topic of much ongoing research. They have been tentatively associated with attention, working memory, and even consciousness
          </ListItemBlock>
        </PopUpList>

        <PopUp onClose={() => this.setState({popUp2Visible: false})} visible={this.state.popUp2Visible}
               title="Brain Computer Interfaces">
          A Brain-Computer Interface is a direct communication channel between the brain and an external device. For example, one can feed information about brain state based on EEG frequency bands to a computer; that computer then analyzes the EEG data and decides what the user intent was. The computer can use that command to control an external device such as a wheelchair or a display.
        </PopUp>

        <PopUp onClose={()=>this.props.history.push('/connectorOne')} visible={this.props.connectionStatus === config.connectionStatus.DISCONNECTED} title='Muse Disconnected'>
        Please reconnect to continue the tutorial</PopUp>

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

export default connect(mapStateToProps)(SlideNine);
