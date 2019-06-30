import { put, takeLatest } from 'redux-saga/effects';
import { showWalkthrough } from './state';
import { HIDE } from 'splash/state';

export default function* walkthroughSagas() {
  yield takeLatest(HIDE, onSplashHide);
}

function* onSplashHide() {
  yield put(showWalkthrough());
}
