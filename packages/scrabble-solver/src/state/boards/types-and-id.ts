/**
 * Re-exported separately from the slice so that `localStorage` can depend on
 * the board shape without importing the slice -- which would import the store
 * and make the dependency circular.
 */
export { FIRST_BOARD_ID } from './initialState';
export type { BoardSnapshot, BoardsMetadata, BoardsState } from './types';
