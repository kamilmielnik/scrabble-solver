import { type FunctionComponent, type SVGAttributes } from 'react';

import Ban from '@/icons/Ban.svg';
import Eraser from '@/icons/Eraser.svg';
import FlagFill from '@/icons/FlagFill.svg';
import { type CellFilter, type TranslationKey } from '@/types';

export const getNextCellFilter = (
  filter: CellFilter | undefined,
): {
  Icon: FunctionComponent<SVGAttributes<SVGElement>>;
  labelTranslationKey: TranslationKey;
} => {
  if (filter?.type === 'exclude') {
    return {
      Icon: Eraser,
      labelTranslationKey: 'common.clear',
    };
  }

  if (filter?.type === 'include') {
    return {
      Icon: Ban,
      labelTranslationKey: 'cell.filter-cell.exclude',
    };
  }

  return {
    Icon: FlagFill,
    labelTranslationKey: 'cell.filter-cell.include',
  };
};
