import { createSelector } from 'reselect';

export const selectRoot = (state) => state.time;
export const selectTime = createSelector(selectRoot, (time) => {
  if(time === null) {
    return null;
  }
  return `${(time / 1000).toFixed(3)} s`;
});
