import { createSelector } from 'reselect';

const selectRoot = (state) => state.config;
export const selectConfig = selectRoot;
export const selectConfigId = createSelector(selectRoot, ({ id }) => id);
export const selectLocale = (state) => state.intl.locale;
