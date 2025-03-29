import { createSelector } from '@reduxjs/toolkit';

import type { Point } from 'types';

import type { RootState } from '../types';

const selectPoint = (_: unknown, point: Point): Point => point;

export const selectCellFilters = (state: RootState) => state.cellFilters;

export const selectCellFilter = createSelector([selectCellFilters, selectPoint], (cellFilters, point) => {
  return cellFilters.find((cell) => cell.x === point.x && cell.y === point.y);
});
