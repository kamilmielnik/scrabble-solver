import { combineReducers } from 'redux';

import { reducer as board } from 'modules/board';
import { reducer as config } from 'modules/config';
import { reducer as i18n } from 'modules/i18n';
import { reducer as results } from 'modules/results';
import { reducer as shared } from 'modules/shared';
import { reducer as tiles } from 'modules/tiles';

const rootReducer = combineReducers({
  board,
  config,
  i18n,
  results,
  shared,
  tiles,
});

export default rootReducer;
