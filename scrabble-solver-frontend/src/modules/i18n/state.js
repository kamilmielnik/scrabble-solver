import { createAction, handleActions } from 'redux-actions';
import translations from './translations';

export const CHANGE_LOCALE = 'i18n/change-locale';

export const changeLocale = createAction(CHANGE_LOCALE);

export const initialState = {
  locale: 'pl-PL',
  translations
};

export default handleActions(
  {
    [CHANGE_LOCALE]: (state, { payload: locale }) => ({
      ...state,
      locale
    })
  },
  initialState
);
