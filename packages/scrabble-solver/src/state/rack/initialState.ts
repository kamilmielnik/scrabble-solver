import { getConfig } from '@scrabble-solver/configs';

import { localStorage } from '../localStorage';
import { settingsInitialState } from '../settings';

import type { RackState } from './types';

const defaultConfig = getConfig(settingsInitialState.game, settingsInitialState.locale);

export const rackDefaultState: RackState = Array(defaultConfig.rackSize).fill(null);

export const rackInitialState: RackState = localStorage.getRack() ?? rackDefaultState;
