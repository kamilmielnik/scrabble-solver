import { useSelector } from 'react-redux';

import { State } from 'state';

import { selectRowsWithCandidate } from '../selectors';

const useRows = () => useSelector<State>(selectRowsWithCandidate);

export default useRows;
