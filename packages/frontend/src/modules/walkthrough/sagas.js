import { put, takeLatest } from 'redux-saga/effects';
import localStorage from 'local-storage';
import { HIDE } from 'splash/state';
import { HIDE_WALKTHROUGH, showWalkthrough } from './state';

export default function* walkthroughSagas() {
  yield takeLatest(HIDE, onSplashHide);
  yield takeLatest(HIDE_WALKTHROUGH, onWalkthroughHide);
}

function* onSplashHide() {
  const walkthroughComplete = localStorage.get('walktrough-complete', false);

  if (!walkthroughComplete) {
    yield put(showWalkthrough());
  }
}

function* onWalkthroughHide() {
  localStorage.set('walktrough-complete', true);
}
