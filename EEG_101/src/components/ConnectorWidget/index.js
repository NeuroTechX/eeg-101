// index.js (ConnectorWidget)
// Binds Redux state to component's props and redux actions to component's props

import Component from './component';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getAndConnectToDevice } from '../../../actions';
import _ from 'lodash';

// Import properties stored in Redux
function mapStateToProps(state) {
	return {
		connectionStatus: state.connectionStatus,
		hasFailedMuseSearch: state.hasSearchedForMuses && _.isEmpty(state.availableMuses),
	}
}

// Binds actions to component's props
function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		getAndConnectToDevice,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);