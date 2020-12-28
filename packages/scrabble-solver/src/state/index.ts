// import { Board, Config, Result, Tile } from '@scrabble-solver/models';
import { combineReducers } from 'redux';

import board from './board';
import config from './config';
import i18n from './i18n';

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
  board: board.reducer,
  config: config.reducer,
  i18n: i18n.reducer,
});

export type State = ReturnType<typeof rootReducer>;
