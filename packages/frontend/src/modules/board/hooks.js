import { useSelector } from 'react-redux';

import { selectRowsWithCandidate } from './selectors';

export const useRows = () => useSelector(selectRowsWithCandidate);
