import type { RootState } from '../types';

export const selectLoadedTranslations = (state: RootState) => state.i18n.translations;
