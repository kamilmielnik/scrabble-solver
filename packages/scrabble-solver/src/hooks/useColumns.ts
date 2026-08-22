import { createSelector } from '@reduxjs/toolkit';
import { useMemo } from 'react';

import { LOCALE_FEATURES } from '@/i18n/constants';
import { selectLocale, useTypedSelector } from '@/state';
import { ResultColumnId } from '@/types';

import { useIsCompactLayout } from './useIsCompactLayout';
import { useMediaQueries } from './useMediaQueries';

const COLUMNS_XS = [ResultColumnId.Coordinates, ResultColumnId.Word, ResultColumnId.Points];

const COLUMNS_S = [...COLUMNS_XS, ResultColumnId.BlanksCount, ResultColumnId.WordsCount];

const COLUMNS_M = [...COLUMNS_XS];

const COLUMNS_COMPACT = [...COLUMNS_XS];

const selectColumns = createSelector([selectLocale], (locale) => {
  const { consonants, vowels } = LOCALE_FEATURES[locale];
  const columns: ResultColumnId[] = [
    ResultColumnId.Word,
    ResultColumnId.TilesCount,
    ResultColumnId.BlanksCount,
    ResultColumnId.WordsCount,
    ResultColumnId.Points,
    ResultColumnId.Coordinates,
  ];

  if (vowels) {
    columns.push(ResultColumnId.VowelsCount);
  }

  if (consonants) {
    columns.push(ResultColumnId.ConsonantsCount);
  }

  return columns;
});

export const useColumns = (): Partial<Record<ResultColumnId, boolean>> => {
  const columns = useTypedSelector(selectColumns);
  const { isLessThanXs, isLessThanS, isLessThanM } = useMediaQueries();
  const isCompactLayout = useIsCompactLayout();

  const filteredColumns = useMemo(() => {
    if (isLessThanXs) {
      return columns.filter((columnId) => COLUMNS_XS.includes(columnId));
    }

    if (isLessThanS) {
      return columns.filter((columnId) => COLUMNS_S.includes(columnId));
    }

    if (isLessThanM) {
      return columns.filter((columnId) => COLUMNS_M.includes(columnId));
    }

    if (isCompactLayout) {
      return columns.filter((columnId) => COLUMNS_COMPACT.includes(columnId));
    }

    return columns;
  }, [columns, isLessThanXs, isLessThanS, isLessThanM, isCompactLayout]);

  const columnsMap = useMemo(() => {
    return Object.fromEntries(filteredColumns.map((column) => [column, true]));
  }, [filteredColumns]);

  return columnsMap;
};
