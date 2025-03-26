import { createSelector } from '@reduxjs/toolkit';
import { getConfig } from '@scrabble-solver/configs';

import { LOCALE_FEATURES } from 'i18n';

import { selectSettings } from './root';

export const selectLocale = createSelector([selectSettings], (settings) => settings.locale);

export const selectAutoGroupTiles = createSelector([selectSettings], (settings) => settings.autoGroupTiles);

export const selectLocaleAutoGroupTiles = createSelector([selectLocale, selectSettings], (locale, settings) => {
  if (LOCALE_FEATURES[locale].direction === 'ltr' || settings.autoGroupTiles === null) {
    return settings.autoGroupTiles;
  }

  return settings.autoGroupTiles === 'left' ? 'right' : 'left';
});

export const selectInputMode = createSelector([selectSettings], (settings) => settings.inputMode);

export const selectShowCoordinates = createSelector([selectSettings], (settings) => settings.showCoordinates);

export const selectGame = createSelector([selectSettings], (settings) => settings.game);

export const selectConfig = createSelector([selectGame, selectLocale], getConfig);
