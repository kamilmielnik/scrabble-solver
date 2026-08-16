import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Game, type Locale, type ShowCoordinates } from '@scrabble-solver/types';

import type { AutoGroupTiles, InputMode, RemoveCellFilters } from '@/types';

import { settingsInitialState } from './initialState';

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

    changeHighlightUnreachableCells: (state, action: PayloadAction<boolean>) => {
      const highlightUnreachableCells = action.payload;
      return { ...state, highlightUnreachableCells };
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

    changeRemoveCellFilters: (state, action: PayloadAction<RemoveCellFilters>) => {
      const removeCellFilters = action.payload;
      return { ...state, removeCellFilters };
    },

    init: (state, action: PayloadAction<Partial<typeof settingsInitialState>>) => {
      const settings = { ...state, ...action.payload };
      const keys = Object.keys(settings) as (keyof typeof settingsInitialState)[];
      const hasDiff = keys.some((key) => settings[key] !== state[key]);
      return hasDiff ? settings : state;
    },
  },
});
