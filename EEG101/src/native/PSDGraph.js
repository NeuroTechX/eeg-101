// PSDGraph.
// A single module for PSD graph view
//. We've wrapped the PSDGraph with extra JS UI in both our PSDGraphView and WaveGraphView components. However, React Native >0.49 complains when a native
// component is imported more than twice. Thus, this file exists.
import PropTypes from "prop-types";
import { requireNativeComponent, ViewPropTypes } from "react-native";

const iface = {
  name: 'PSDGraph',
  propTypes: {
        channelOfInterest: PropTypes.number,
        graphType: PropTypes.string,
        isRecording: PropTypes.bool,
        offlineData: PropTypes.string,
        isPlaying: PropTypes.bool,
        notchFrequency: PropTypes.number,
    ...ViewPropTypes // include the default view properties
  },
};

const PSDGraph = requireNativeComponent("PSD_GRAPH", iface);

export default PSDGraph;
