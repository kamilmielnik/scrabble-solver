import { takeLatest } from 'redux-saga/effects';

import localStorage, { WALKTROUGH_COMPLETE } from 'local-storage';

import { HIDE_WALKTHROUGH } from './state';

export function* sagas() {
  yield takeLatest(HIDE_WALKTHROUGH, onWalkthroughHide);
}

const onWalkthroughHide = () => {
  localStorage.set(WALKTROUGH_COMPLETE, true);
};
