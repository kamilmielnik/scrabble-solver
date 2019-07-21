import { createAction, handleActions } from 'redux-actions';

import localStorage, { LOCALE } from 'local-storage';

import translations from './translations';

export const CHANGE_LOCALE = 'i18n/change-locale';

export const changeLocale = createAction(CHANGE_LOCALE);

export const initialState = {
  locale: localStorage.get(LOCALE, 'pl-PL'),
  translations
};

export const reducer = handleActions(
  {
    [CHANGE_LOCALE]: (state, { payload: locale }) => ({
      ...state,
      locale
    })
  },
  initialState
);
