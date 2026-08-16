import type { RootState } from '../types';

export const selectIsHydrated = (state: RootState): boolean => state.app.isHydrated;

export const selectVersion = (state: RootState): string => state.app.version;
