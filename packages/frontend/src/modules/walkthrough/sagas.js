import { put, takeLatest } from 'redux-saga/effects';

import localStorage, { WALKTROUGH_COMPLETE } from 'local-storage';
import { HIDE_SPLASH } from 'splash/state';

import { HIDE_WALKTHROUGH, showWalkthrough } from './state';

export function* sagas() {
  yield takeLatest(HIDE_SPLASH, onSplashHide);
  yield takeLatest(HIDE_WALKTHROUGH, onWalkthroughHide);
}

function* onSplashHide() {
  const walkthroughComplete = localStorage.get(WALKTROUGH_COMPLETE, false);

  if (!walkthroughComplete) {
    yield put(showWalkthrough());
  }
}

const onWalkthroughHide = () => {
  localStorage.set(WALKTROUGH_COMPLETE, true);
};
