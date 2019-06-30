import { takeLatest } from 'redux-saga/effects';
import localStorage, { CONFIG } from 'local-storage';
import { CHANGE_CONFIG } from './state';

export default function* configSagas() {
  yield takeLatest(CHANGE_CONFIG, onConfigChange);
}

function onConfigChange({ payload: config }) {
  localStorage.set(CONFIG, config.id);
}
