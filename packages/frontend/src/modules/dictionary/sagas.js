import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { CHANGE_LOCALE, selectLocale } from 'i18n';
import { getWordDefinition } from 'api';

import { SUBMIT, clearInput, search, searchFailure, searchSuccess } from './state';
import { selectDefinitionsWord, selectInput } from './selectors';

const SUBMIT_DELAY = 100;

export default function* dictionarySagas() {
  yield takeLatest(SUBMIT, onDictionarySubmit);
  yield takeLatest(CHANGE_LOCALE, onLocaleChange);
}

function* onLocaleChange() {
  yield delay(SUBMIT_DELAY);
  const word = yield select(selectDefinitionsWord);
  const locale = yield select(selectLocale);
  yield* makeRequest(word, locale);
}

function* onDictionarySubmit() {
  yield delay(SUBMIT_DELAY);
  const word = yield select(selectInput);
  const locale = yield select(selectLocale);
  yield* makeRequest(word, locale);
}

function* makeRequest(query, locale) {
  if (query.length > 0) {
    try {
      yield put(search());
      const { isAllowed, definitions, word } = yield call(getWordDefinition, locale, query);
      yield put(clearInput());
      yield put(searchSuccess({ isAllowed, definitions, word }));
    } catch (error) {
      yield put(searchFailure(error));
    }
  }
}
