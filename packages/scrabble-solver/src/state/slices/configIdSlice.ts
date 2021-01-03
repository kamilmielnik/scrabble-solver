import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import configIdInitialState from './configIdInitialState';

const configIdSlice = createSlice({
  initialState: configIdInitialState,
  name: 'configId',
  reducers: {
    change: (_state, action: PayloadAction<typeof configIdInitialState>) => {
      return action.payload;
    },
  },
});

export default configIdSlice;
