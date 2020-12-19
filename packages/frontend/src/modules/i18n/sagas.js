import { takeLatest } from 'redux-saga/effects';

import localStorage, { LOCALE } from 'modules/local-storage';

import { CHANGE_LOCALE } from './state';

export function* sagas() {
  yield takeLatest(CHANGE_LOCALE, onLocaleChange);
}

const onLocaleChange = ({ payload: locale }) => {
  localStorage.set(LOCALE, locale);
};
