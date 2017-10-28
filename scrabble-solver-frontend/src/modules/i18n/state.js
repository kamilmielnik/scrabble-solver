import { createAction, handleActions } from 'redux-actions';
import translations from './translations';

export const CHANGE_LOCALE = 'i18n/change-locale';

export const changeLocale = createAction(CHANGE_LOCALE);

export const initialState = translations['en-US'];

export default handleActions({
  [CHANGE_LOCALE]: (state, { payload: locale }) => translations[locale]
}, initialState);
