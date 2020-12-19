import { takeLatest } from 'redux-saga/effects';

import localStorage, { CONFIG } from 'modules/local-storage';

import { CHANGE_CONFIG } from './state';

export function* sagas() {
  yield takeLatest(CHANGE_CONFIG, onConfigChange);
}

const onConfigChange = ({ payload: config }) => {
  localStorage.set(CONFIG, config.id);
};
