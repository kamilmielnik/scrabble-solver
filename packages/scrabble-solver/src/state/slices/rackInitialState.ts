import { Rack } from 'types';

import { localStorage } from '../localStorage';

export type RackState = Rack;

export const rackDefaultState: RackState = [null, null, null, null, null, null, null];

export const rackInitialState: RackState = localStorage.getRack() || rackDefaultState;
