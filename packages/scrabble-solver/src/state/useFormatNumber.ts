import { useCallback, useMemo } from 'react';

import { selectLocale } from './selectors';
import useTypedSelector from './useTypedSelector';

type FormatNumber = (value: number) => string;

const useFormatNumber = (options?: Intl.NumberFormatOptions): FormatNumber => {
  const locale = useTypedSelector(selectLocale);
  const formatter = useMemo(() => new Intl.NumberFormat(locale, options), [locale, options]);
  const formatNumber = useCallback((value: number) => formatter.format(value), [formatter]);
  return formatNumber;
};

export default useFormatNumber;
