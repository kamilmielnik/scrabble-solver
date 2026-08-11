import { createSlice } from '@reduxjs/toolkit';

import { appInitialState } from './initialState';

export const appSlice = createSlice({
  initialState: appInitialState,
  name: 'app',
  reducers: {
    hydrated: (state) => {
      state.isHydrated = true;
    },
  },
});
