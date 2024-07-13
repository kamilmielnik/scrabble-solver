import { useMemo } from 'react';

import { selectColumns, useTypedSelector } from 'state';
import { ResultColumnId } from 'types';

import useMediaQueries from './useMediaQueries';

const COLUMNS_XS = [ResultColumnId.Coordinates, ResultColumnId.Word, ResultColumnId.Points];

const COLUMNS_S = [...COLUMNS_XS, ResultColumnId.BlanksCount, ResultColumnId.WordsCount];

const COLUMNS_M = [...COLUMNS_XS];

const COLUMNS_L = [...COLUMNS_XS];

const useColumns = (): Partial<Record<ResultColumnId, boolean>> => {
  const columns = useTypedSelector(selectColumns);
  const { isLessThanXs, isLessThanS, isLessThanM, isLessThanL } = useMediaQueries();

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

    if (isLessThanL) {
      return columns.filter((columnId) => COLUMNS_L.includes(columnId));
    }

    return columns;
  }, [columns, isLessThanXs, isLessThanS, isLessThanM, isLessThanL]);

  const columnsMap = useMemo(() => {
    return Object.fromEntries(filteredColumns.map((column) => [column, true]));
  }, [filteredColumns]);

  return columnsMap;
};

export default useColumns;
