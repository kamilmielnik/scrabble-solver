import { useSelector } from 'react-redux';

import { selectBonus, selectCharacterPoints, selectRowsWithCandidate } from './selectors';

export const useRows = () => useSelector(selectRowsWithCandidate);

export const useBonus = (cell) => useSelector((state) => selectBonus(state, cell));

export const useCharacterPoints = (cell) => useSelector((state) => selectCharacterPoints(state, cell));
