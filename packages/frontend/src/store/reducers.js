import { combineReducers } from 'redux';

import { reducer as board } from 'board';
import { reducer as config } from 'config';
import { reducer as i18n } from 'i18n';
import { reducer as results } from 'results';
import { reducer as shared } from 'shared';
import { reducer as tiles } from 'tiles';

const rootReducer = combineReducers({
  board,
  config,
  i18n,
  results,
  shared,
  tiles
});

export default rootReducer;
