import { createSelector } from 'reselect';

import { selectLocale } from 'i18n';

const selectRoot = (state) => state.config;

export const selectConfig = createSelector(
  [selectRoot, selectLocale],
  (config, locale) => config[locale]
);

export const selectConfigId = createSelector(
  selectConfig,
  ({ id }) => id
);
