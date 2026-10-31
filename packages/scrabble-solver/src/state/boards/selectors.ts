import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../types';

export const selectBoards = (state: RootState) => state.boards;

export const selectActiveBoardId = (state: RootState) => state.boards.activeId;

export const selectBoardsOrder = (state: RootState) => state.boards.order;

export const selectBoardNames = (state: RootState) => state.boards.names;

export interface BoardTab {
  id: string;
  isActive: boolean;
  /** Only set once the user has renamed the board. */
  name?: string;
  /** Position in the strip, 1-based, used for the default label. */
  number: number;
}

/**
 * The tabs, in order.
 *
 * A board only has a `name` once the user gives it one; otherwise it is
 * labelled by its position, worked out here rather than stored. That means
 * removing a board renumbers the ones after it, which is what a tab strip
 * normally does -- and it keeps the default label translatable, which a
 * stored name could not be.
 */
export const selectBoardTabs = createSelector(
  [selectBoardsOrder, selectBoardNames, selectActiveBoardId],
  (order, names, activeId): BoardTab[] =>
    order.map((id, index) => ({
      id,
      isActive: id === activeId,
      name: names[id],
      number: index + 1,
    })),
);

export const selectCanRemoveBoard = createSelector([selectBoardsOrder], (order) => order.length > 1);
