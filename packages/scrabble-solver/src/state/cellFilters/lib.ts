import type { CellFilterType } from 'types';

export const toggleCellFilterState = (type: CellFilterType): CellFilterType | null => {
  const chain: (CellFilterType | null)[] = ['include', 'exclude', null];
  const index = chain.indexOf(type);
  const nextIndex = (index + 1) % chain.length;
  return chain[nextIndex];
};
