import { createSelector } from '@reduxjs/toolkit';

import { Point } from 'types';

import { selectCellFilters } from './root';

const selectPoint = (_: unknown, point: Point): Point => point;

export const selectCellFilter = createSelector([selectCellFilters, selectPoint], (cellFilters, point) => {
  return cellFilters.find((cell) => cell.x === point.x && cell.y === point.y);
});
