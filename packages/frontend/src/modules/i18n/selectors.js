import { createSelector } from 'reselect';

import { formatMessage } from './utils';

const selectRoot = (state) => state.i18n;

export const selectLocale = createSelector(selectRoot, ({ locale }) => locale);

export const selectTranslations = createSelector(selectRoot, ({ translations }) => translations);

export const selectMessage = createSelector(
  [selectTranslations, selectLocale, (state, ownProps) => ownProps],
  (translations, locale, { id, locale: localeOverride, values }) =>
    formatMessage(translations[localeOverride || locale][id], values)
);
