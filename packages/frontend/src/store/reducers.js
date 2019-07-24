import { combineReducers } from 'redux';

import board from 'board/state';
import { reducer as config } from 'config/state';
import dictionary from 'dictionary/state';
import { reducer as i18n } from 'i18n';
import { reducer as results } from 'results';
import shared from 'shared/state';
import splash from 'splash/state';
import { reducer as tiles } from 'tiles';
import { reducer as time } from 'time';
import walkthrough from 'walkthrough/state';

const rootReducer = combineReducers({
  board,
  config,
  dictionary,
  i18n,
  results,
  shared,
  splash,
  tiles,
  time,
  walkthrough
});

export default rootReducer;
