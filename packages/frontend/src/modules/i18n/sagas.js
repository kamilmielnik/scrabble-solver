import { takeLatest } from 'redux-saga/effects';
import localStorage from 'local-storage';
import { CHANGE_LOCALE } from './state';

export default function* i18nSagas() {
  yield takeLatest(CHANGE_LOCALE, onLocaleChange);
}

function* onLocaleChange({ payload: locale }) {
  localStorage.set('locale', locale);
}
