import { useMediaQueries } from 'hooks';
import { LOCALE_FEATURES } from 'i18n';
import { selectLocale, selectShowCoordinates, useTypedSelector } from 'state';
import { ResultColumn, ResultColumnId } from 'types';

import getCoordinatesColumn from './getCoordinatesColumn';
import getLocaleColumns from './getLocaleColumns';

const COLUMNS_XS = [ResultColumnId.Coordinates, ResultColumnId.Word, ResultColumnId.Points];

const COLUMNS_S = [...COLUMNS_XS, ResultColumnId.BlanksCount, ResultColumnId.WordsCount];

const COLUMNS_M = [...COLUMNS_XS];

const COLUMNS_L = [...COLUMNS_XS];

const useColumns = (): ResultColumn[] => {
  const locale = useTypedSelector(selectLocale);
  const localeColumns = getLocaleColumns(LOCALE_FEATURES[locale]);
  const showCoordinates = useTypedSelector(selectShowCoordinates);
  const columns = showCoordinates === 'hidden' ? localeColumns : [getCoordinatesColumn(), ...localeColumns];
  const { isLessThanXs, isLessThanS, isLessThanM, isLessThanL } = useMediaQueries();

  if (isLessThanXs) {
    return columns.filter((column) => COLUMNS_XS.includes(column.id));
  }

  if (isLessThanS) {
    return columns.filter((column) => COLUMNS_S.includes(column.id));
  }

  if (isLessThanM) {
    return columns.filter((column) => COLUMNS_M.includes(column.id));
  }

  if (isLessThanL) {
    return columns.filter((column) => COLUMNS_L.includes(column.id));
  }

  return columns;
};

export default useColumns;
