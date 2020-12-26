// import { Board, Config, Result, Tile } from '@scrabble-solver/models';
import { combineReducers } from 'redux';

// export interface State {
//   board: Board;
//   config: Config;
//   results: {
//     candidate: Result | null;
//     results: Result[];
//   };
//   tiles: (Tile | null)[];
// }

export const rootReducer = combineReducers({
  board: boardReducer,
  // config:
});

export type State = ReturnType<typeof rootReducer>;
