import { combineReducers } from 'redux';

import { reducer as board } from 'board';
import { reducer as config } from 'config';
import dictionary from 'dictionary/state';
import { reducer as i18n } from 'i18n';
import { reducer as results } from 'results';
import { reducer as shared } from 'shared';
import { reducer as tiles } from 'tiles';
import { reducer as walkthrough } from 'walkthrough';

const rootReducer = combineReducers({
  board,
  config,
  dictionary,
  i18n,
  results,
  shared,
  tiles,
  walkthrough
});

export default rootReducer;
