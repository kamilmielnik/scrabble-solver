import { type BoardsState } from './types';

/** Id of the board that exists before anything has been saved. */
export const FIRST_BOARD_ID = 'board-1';

export const boardsInitialState: BoardsState = {
  activeId: FIRST_BOARD_ID,
  names: {},
  order: [FIRST_BOARD_ID],
  saved: {},
};
