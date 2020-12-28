import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Config } from '@scrabble-solver/models';

import configInitialState from './configInitialState';
import i18nInitialState from './i18nInitialState';

const { locale } = i18nInitialState;

const config = createSlice({
  initialState: configInitialState[locale],
  name: 'config',
  reducers: {
    changeConfig: (_state, action: PayloadAction<Config>) => {
      return action.payload;
    },
  },
});

export default config;
