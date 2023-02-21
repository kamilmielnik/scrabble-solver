import { useMediaQuery } from 'hooks';
import { LOCALE_FEATURES } from 'i18n';
import { selectLocale, useTypedSelector } from 'state';
import { ResultColumn } from 'types';

import getLocaleColumns from './getLocaleColumns';
import { Column } from './types';

const COLUMNS_XS = [ResultColumn.Word, ResultColumn.Points];

const COLUMNS_S = [...COLUMNS_XS, ResultColumn.BlanksCount, ResultColumn.WordsCount];

const COLUMNS_M = [...COLUMNS_XS];

const COLUMNS_L = [...COLUMNS_XS];

const useColumns = (): Column[] => {
  const locale = useTypedSelector(selectLocale);
  const localeColumns = getLocaleColumns(LOCALE_FEATURES[locale]);
  const isLessThanXs = useMediaQuery('<xs');
  const isLessThanS = useMediaQuery('<s');
  const isLessThanM = useMediaQuery('<m');
  const isLessThanL = useMediaQuery('<l');

  if (isLessThanXs) {
    return localeColumns.filter((column) => COLUMNS_XS.includes(column.id));
  }

  if (isLessThanS) {
    return localeColumns.filter((column) => COLUMNS_S.includes(column.id));
  }

  if (isLessThanM) {
    return localeColumns.filter((column) => COLUMNS_M.includes(column.id));
  }

  if (isLessThanL) {
    return localeColumns.filter((column) => COLUMNS_L.includes(column.id));
  }

  return localeColumns;
};

export default useColumns;
