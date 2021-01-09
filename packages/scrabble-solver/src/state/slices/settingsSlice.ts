import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import settingsInitialState from './settingsInitialState';

const settingsSlice = createSlice({
  initialState: settingsInitialState,
  name: 'settings',
  reducers: {
    changeAutoDirectionChange: (state, action: PayloadAction<boolean>) => {
      const autoDirectionChange = action.payload;
      return { ...state, autoDirectionChange };
    },

    changeConfigId: (state, action: PayloadAction<string>) => {
      const configId = action.payload;
      return { ...state, configId };
    },
  },
});

export default settingsSlice;
