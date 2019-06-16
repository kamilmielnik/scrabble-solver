import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { formatMessage } from 'i18n/utils';

const selectRoot = (state) => state.i18n;
export const selectLocale = createSelector(
  selectRoot,
  ({ locale }) => locale
);
export const selectTranslations = createSelector(
  selectRoot,
  ({ translations }) => translations
);
export const selectMessage = createCachedSelector(
  [selectTranslations, selectLocale, (state, ownProps) => ownProps],
  (translations, locale, { id, locale: localeOverride, values }) =>
    formatMessage(translations[localeOverride || locale][id], values)
)(
  (state, locale, { id, locale: localeOverride, values } = {}) =>
    `${localeOverride || locale}-${id}-${JSON.stringify(values)}`
);
