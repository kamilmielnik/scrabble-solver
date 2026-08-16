import type { BoardWord } from '@scrabble-solver/types';

import type { RootState } from '../types';

export const selectHoveredWord = (state: RootState): BoardWord | null => state.hoveredWord.word;
