import { createSelector } from 'reselect';
import { Config } from 'scrabble-solver-commons/models';
import { selectLocale } from 'i18n/selectors';

const selectRoot = (state) => state.config;
export const selectConfig = createSelector(
  [selectRoot, selectLocale],
  (config, locale) => new Config(config[locale])
);
export const selectConfigId = createSelector(
  selectConfig,
  ({ id }) => id
);
