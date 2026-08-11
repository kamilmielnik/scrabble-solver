import { Locale } from '@scrabble-solver/types';
import { type FunctionComponent, type SVGAttributes } from 'react';

import { FlagDe, FlagEs, FlagFa, FlagFr, FlagGb, FlagPl, FlagRo, FlagTr, FlagUs } from '@/icons';

/**
 * Kept out of the i18n barrel file to keep them out of the main bundle.
 */
export const LOCALE_ICONS: Record<Locale, FunctionComponent<SVGAttributes<SVGElement>>> = {
  [Locale.DE_DE]: FlagDe,
  [Locale.EN_GB]: FlagGb,
  [Locale.EN_US]: FlagUs,
  [Locale.ES_ES]: FlagEs,
  [Locale.FA_IR]: FlagFa,
  [Locale.FR_FR]: FlagFr,
  [Locale.PL_PL]: FlagPl,
  [Locale.RO_RO]: FlagRo,
  [Locale.TR_TR]: FlagTr,
};
