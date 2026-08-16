import { type Locale } from '@scrabble-solver/types';

import type { Translations } from '@/types';

export interface I18nState {
  translations: Partial<Record<Locale, Translations>>;
}
