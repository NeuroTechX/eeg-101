// config.js
// Stores variables that are used in Redux
import I18n from "../i18n/i18n";

export default {
  navbarHeight: 64,
  statusbarHeight: 20,
  connectionStatus: {
    CONNECTED: {I18n.t('configConnected')},
    CONNECTING: {I18n.t('configConnecting')},
    DISCONNECTED: {I18n.t('configDisconnected')},
    NO_MUSES: {I18n.t('configNoMuses')},
  },
  graphType: {
    EEG: {I18n.t('configEeg')},
    FILTER: {I18n.t('configFilter')},
    PSD: {I18n.t('configPsd')},
    WAVES: {I18n.t('configWaves')},
    ARTEFACT: {I18n.t('configArtefact')}
  },
  filterType: {
    LOWPASS: {I18n.t('configLowpass')},
    HIGHPASS: {I18n.t('configHighpass')},
    BANDSTOP: {I18n.t('configBandstop')},
    BANDPASS: {I18n.t('configBandpass')},
  },
  bciAction: {
    LIGHT: {I18n.t('configLight')},
    VIBRATE: {I18n.t('configVibrate')},
  },
}
