import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Locale } from 'types';

import settingsInitialState from './settingsInitialState';

const settingsSlice = createSlice({
  initialState: settingsInitialState,
  name: 'settings',
  reducers: {
    changeAutoDirectionChange: (state, action: PayloadAction<boolean>) => {
      const autoDirectionChange = action.payload;
      return { ...state, autoDirectionChange };
    },

    changeAutoMoveTiles: (state, action: PayloadAction<'left' | 'right' | null>) => {
      const autoMoveTiles = action.payload;
      return { ...state, autoMoveTiles };
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
