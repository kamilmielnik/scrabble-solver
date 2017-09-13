import { combineReducers } from 'redux';
import { intlReducer as intl } from 'react-intl-redux';
import board from 'modules/board/state';
import config from 'modules/config/state';
import dictionary from 'modules/dictionary/state';
import results from 'modules/results/state';
import shared from 'modules/shared/state';
import tiles from 'modules/tiles/state';
import time from 'modules/time/state';

const rootReducer = combineReducers({
  board,
  config,
  dictionary,
  intl,
  results,
  shared,
  tiles,
  time
});

export default rootReducer;
