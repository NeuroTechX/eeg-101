// config.js
// Stores variables that are used in Redux

export default {
  navbarHeight: 64,
  statusbarHeight: 20,
  connectionStatus: {
    CONNECTED: 'CONNECTED',
    CONNECTING: 'CONNECTING',
    DISCONNECTED: 'DISCONNECTED',
    NO_MUSES: 'NO_MUSES',
  },
  graphType: {
    EEG: 'EEG',
    FILTER: 'FILTER',
    PSD: 'PSD',
    WAVES: 'WAVES',
    ARTEFACT: 'ARTEFACT'
  },
  filterType: {
    LOWPASS: 'LOWPASS',
    HIGHPASS: 'HIGHPASS',
    BANDSTOP: 'BANDSTOP',
    BANDPASS: 'BANDPASS',
  },
  bciAction: {
    LIGHT: 'the light',
    VIBRATE: 'vibration',
  },
}
