import { createSlice } from '@reduxjs/toolkit';

import { initialize } from '../actions';

import { appInitialState } from './initialState';

export const appSlice = createSlice({
  initialState: appInitialState,
  name: 'app',
  reducers: {
    hydrated: (state) => {
      state.isHydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initialize, (state, action) => {
      state.version = action.payload.version;
    });
  },
});
