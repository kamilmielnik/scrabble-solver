import { Rack } from 'types';

import localStorage from '../localStorage';

export type RackState = Rack;

const getRackDefaultState = (): RackState => [null, null, null, null, null, null, null];

const rackInitialState: RackState = localStorage.getRack() || getRackDefaultState();

export default rackInitialState;
