import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Locale } from 'types';

import settingsInitialState from './settingsInitialState';

const settingsSlice = createSlice({
  initialState: settingsInitialState,
  name: 'settings',
  reducers: {
    changeAutoGroupTiles: (state, action: PayloadAction<'left' | 'right' | null>) => {
      const autoGroupTiles = action.payload;
      return { ...state, autoGroupTiles };
    },

    changeConfigId: (state, action: PayloadAction<string>) => {
      const configId = action.payload;
      return { ...state, configId };
    },

    changeLocale: (state, action: PayloadAction<Locale>) => {
      const locale = action.payload;
      return { ...state, locale };
    },
  },
});

export default settingsSlice;
