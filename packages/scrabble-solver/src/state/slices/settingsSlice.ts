import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game, Locale, ShowCoordinates } from '@scrabble-solver/types';

import { AutoGroupTiles, InputMode } from 'types';

import { settingsInitialState } from './settingsInitialState';

export const settingsSlice = createSlice({
  initialState: settingsInitialState,
  name: 'settings',
  reducers: {
    changeAutoGroupTiles: (state, action: PayloadAction<AutoGroupTiles>) => {
      const autoGroupTiles = action.payload;
      return { ...state, autoGroupTiles };
    },

    changeGame: (state, action: PayloadAction<Game>) => {
      const game = action.payload;
      return { ...state, game };
    },

    changeInputMode: (state, action: PayloadAction<InputMode>) => {
      const inputMode = action.payload;
      return { ...state, inputMode };
    },

    changeLocale: (state, action: PayloadAction<Locale>) => {
      const locale = action.payload;
      return { ...state, locale };
    },

    changeShowCoordinates: (state, action: PayloadAction<ShowCoordinates>) => {
      const showCoordinates = action.payload;
      return { ...state, showCoordinates };
    },

    init: (state, action: PayloadAction<Partial<Pick<typeof settingsInitialState, 'game' | 'locale'>>>) => {
      return { ...state, ...action.payload };
    },
  },
});
