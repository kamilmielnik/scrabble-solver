import { createSelector } from 'reselect';

const selectRoot = (state) => state.splash;
export const selectIsShown = createSelector(selectRoot, ({ isShown }) => isShown);
