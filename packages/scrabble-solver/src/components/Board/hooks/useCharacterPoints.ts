import { Cell } from '@scrabble-solver/models';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { State } from 'state';

import { createSelectCharacterPoints } from '../selectors';

const useCharacterPoints = (cell: Cell) => {
  const selectCharacterPoints = useMemo(() => createSelectCharacterPoints(), []);
  return useSelector<State>((state) => selectCharacterPoints(state, cell));
};

export default useCharacterPoints;
