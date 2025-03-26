import { createSelector } from '@reduxjs/toolkit';

import { selectVerify } from './root';

export const selectInvalidWords = createSelector([selectVerify], (verify) => verify.invalidWords);

export const selectValidWords = createSelector([selectVerify], (verify) => verify.validWords);

export const selectHasInvalidWords = createSelector([selectInvalidWords], (invalidWords) => invalidWords.length > 0);
