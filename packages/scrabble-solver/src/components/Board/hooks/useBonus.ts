import { Cell } from '@scrabble-solver/models';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { State } from 'state';

import { createSelectBonus } from '../selectors';

const useBonus = (cell: Cell) => {
  const selectBonus = useMemo(() => createSelectBonus(), []);
  return useSelector<State>((state) => selectBonus(state, cell));
};

export default useBonus;
