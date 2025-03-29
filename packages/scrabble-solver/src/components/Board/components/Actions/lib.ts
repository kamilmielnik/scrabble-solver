import { type FunctionComponent, type SVGAttributes } from 'react';

import { Ban, Eraser, FlagFill } from 'icons';
import { type CellFilter, type TranslationKey } from 'types';

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
