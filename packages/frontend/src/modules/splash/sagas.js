import { takeLatest } from 'redux-saga/effects';
import localStorage, { SPLASH_COMPLETE } from 'local-storage';
import { HIDE_SPLASH } from './state';

export default function* splashSagas() {
  yield takeLatest(HIDE_SPLASH, onSplashHide);
}

function onSplashHide() {
  localStorage.set(SPLASH_COMPLETE, true);
}
