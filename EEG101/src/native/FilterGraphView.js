// CircBufferGraphView.js
// The interface layer between JS and Java. Most of the work is handled internally by react-native, so all that is necessary to here is to define the PropTypes that will be communicated from JS to the Java component

import PropTypes from 'prop-types';
import { requireNativeComponent, ViewPropTypes } from 'react-native';

const iface = {
  name: 'FilterGraphView',
  propTypes: {
        channelOfInterest: PropTypes.number,
        filterType: PropTypes.string,
        isRecording: PropTypes.bool,
        offlineData: PropTypes.string,
        notchFrequency: PropTypes.number,
    ...ViewPropTypes // include the default view properties
  },
};

// requireNativeComponent takes 2 arguments: name of the Java view and and object that defines the interface. The interface defines a name for the object and declares the propTypes in order to check validity of the user's use of the native view.
module.exports = requireNativeComponent('FILTER_GRAPH', iface);
