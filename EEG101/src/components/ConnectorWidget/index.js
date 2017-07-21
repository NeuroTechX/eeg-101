// index.js (ConnectorWidget)
// Binds Redux state and actions to component's props

import Component from "./component";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  getAndConnectToDevice,
  setConnectionStatus,
  setOfflineMode
} from "../../redux/actions";

// Import properties stored in Redux
function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
    isOfflineMode: state.isOfflineMode
  };
}

// Binds actions to component's props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAndConnectToDevice,
      setConnectionStatus,
      setOfflineMode,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
