import { delay } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { selectLocale } from 'i18n/selectors';
import { SUBMIT, clearInput, search, searchFailure, searchSuccess } from './state';
import { selectInput } from './selectors';
import { getWordDefinition } from 'api';

const SUBMIT_DELAY = 100;

export default function* dictionarySagas() {
  yield takeLatest(SUBMIT, onDictionarySubmit);
}

function* onDictionarySubmit() {
  yield delay(SUBMIT_DELAY);
  const word = yield select(selectInput);
  const locale = yield select(selectLocale);
  if (word.length > 0) {
    try {
      yield put(search());
      const { isAllowed, definitions } = yield call(getWordDefinition, locale, word);
      yield put(clearInput());
      yield put(searchSuccess({ isAllowed, definitions, word }));
    } catch (error) {
      yield put(searchFailure(error));
    }
  }
}
