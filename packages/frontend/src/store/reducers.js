import { combineReducers } from 'redux';

import board from 'board/state';
import config from 'config/state';
import dictionary from 'dictionary/state';
import i18n from 'i18n/state';
import { reducer as results } from 'results';
import shared from 'shared/state';
import splash from 'splash/state';
import { reducer as tiles } from 'tiles';
import time from 'time/state';
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
