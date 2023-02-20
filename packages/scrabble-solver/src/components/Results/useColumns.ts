import { useMediaQuery } from 'hooks';
import { LOCALE_FEATURES } from 'i18n';
import { selectLocale, useTypedSelector } from 'state';
import { ResultColumn } from 'types';

import getLocaleColumns from './getLocaleColumns';
import { Column } from './types';

const COLUMNS_XS = [ResultColumn.Word, ResultColumn.Points];

const COLUMNS_S = [...COLUMNS_XS, ResultColumn.BlanksCount, ResultColumn.WordsCount];

const useColumns = (): Column[] => {
  const locale = useTypedSelector(selectLocale);
  const localeColumns = getLocaleColumns(LOCALE_FEATURES[locale]);
  const isXs = useMediaQuery('<xs');
  const isS = useMediaQuery('<s');

  if (isXs) {
    return localeColumns.filter((column) => COLUMNS_XS.includes(column.id));
  }

  if (isS) {
    return localeColumns.filter((column) => COLUMNS_S.includes(column.id));
  }

  return localeColumns;
};

export default useColumns;
