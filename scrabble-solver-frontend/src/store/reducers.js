import { combineReducers } from 'redux';
import board from 'modules/board/state';
import config from 'modules/config/state';
import dictionary from 'modules/dictionary/state';
import i18n from 'modules/i18n/state';
import results from 'modules/results/state';
import shared from 'modules/shared/state';
import splash from 'modules/splash/state';
import tiles from 'modules/tiles/state';
import time from 'modules/time/state';

const rootReducer = combineReducers({
  board,
  config,
  dictionary,
  i18n,
  results,
  shared,
  splash,
  tiles,
  time
});

export default rootReducer;
