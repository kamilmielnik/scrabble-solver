import type { RootState } from '../types';

export const selectHoveredCharacter = (state: RootState): string | null => state.hoveredTile.character;
