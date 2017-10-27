import { takeEvery, put } from 'redux-saga/effects';
import { updateIntl } from 'react-intl-redux';
import intl from 'intl';
import { CHANGE_LOCALE } from './state';

export default function* configSagas() {
  yield takeEvery(CHANGE_LOCALE, onLocaleChange);
}

function* onLocaleChange({ payload: locale }) {
  yield put(updateIntl(intl[locale]));
}
