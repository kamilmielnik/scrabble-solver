import { Locale } from '@scrabble-solver/types';
import { type FunctionComponent, type SVGAttributes } from 'react';

import FlagDe from '@/icons/FlagDe.svg';
import FlagEs from '@/icons/FlagEs.svg';
import FlagFa from '@/icons/FlagFa.svg';
import FlagFr from '@/icons/FlagFr.svg';
import FlagGb from '@/icons/FlagGb.svg';
import FlagPl from '@/icons/FlagPl.svg';
import FlagRo from '@/icons/FlagRo.svg';
import FlagTr from '@/icons/FlagTr.svg';
import FlagUs from '@/icons/FlagUs.svg';

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
