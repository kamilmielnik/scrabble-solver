import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Locale } from '@scrabble-solver/types';

import type { Translations } from '@/types';

import { i18nInitialState } from './initialState';

export const i18nSlice = createSlice({
  initialState: i18nInitialState,
  name: 'i18n',
  reducers: {
    loaded: (state, action: PayloadAction<{ locale: Locale; translations: Translations }>) => {
      state.translations[action.payload.locale] = action.payload.translations;
    },
  },
});
