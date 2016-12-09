// GraphView.js
// The interface layer between JS and Java. Most of the work is handled internally by react-native, so all that is necessary to here is to define the PropTypes that will be communicated from JS to the Java component
import { PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';

var iface = {
  name: 'GraphView',
  propTypes: { 
        visibility: PropTypes.bool,
        channelOfInterest: PropTypes.number,
        graphType: PropTypes.string,
    ...View.propTypes // include the default view properties
  },
};

// requireNativeComponent takes 2 arguments: name of the Java view and and object that defines the interface. For now, this is an object ("iface") that specifies a name and propTypes. For more complex interactions between Java and JS, this would be replaced by a wrapped component. The component would be a class defined in this file.
module.exports = requireNativeComponent('EEG_GRAPH', iface);
