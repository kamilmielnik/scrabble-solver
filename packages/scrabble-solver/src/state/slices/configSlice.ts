import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import configInitialState from './configInitialState';

const configSlice = createSlice({
  initialState: configInitialState,
  name: 'config',
  reducers: {
    changeConfig: (_state, action: PayloadAction<typeof configInitialState>) => {
      return action.payload;
    },
  },
});

export default configSlice;
