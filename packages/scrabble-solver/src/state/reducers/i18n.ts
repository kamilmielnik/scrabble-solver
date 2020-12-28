import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Locale } from 'types';

import i18nInitialState from './i18nInitialState';

const i18n = createSlice({
  initialState: i18nInitialState,
  name: 'i18n',
  reducers: {
    changeLocale: (state, action: PayloadAction<Locale>) => {
      const locale = action.payload;
      return { ...state, locale };
    },
  },
});

export default i18n;
