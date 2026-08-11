import type { RootState } from '../types';

export const selectIsHydrated = (state: RootState): boolean => state.app.isHydrated;
