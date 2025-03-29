import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../types';

export const selectVerify = (state: RootState) => state.verify;

export const selectInvalidWords = createSelector([selectVerify], (verify) => verify.invalidWords);

export const selectValidWords = createSelector([selectVerify], (verify) => verify.validWords);
