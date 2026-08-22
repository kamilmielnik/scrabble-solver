import type { VerifiedWord } from '@/types';

import type { RootState } from '../types';

export const selectHoveredWord = (state: RootState): VerifiedWord | null => state.hoveredWord.word;
