import { useCallback, useEffect, useState } from 'react';
import { useListRef } from 'react-window';

import { useLatest } from '@/hooks/useLatest';

interface ListSize {
  height: number;
  width: number;
}

/**
 * Centers the row at `index` when `results` change and when the list gets its
 * first height: before that, the list centers the row on a zero-height list.
 */
export function useCenteredRow(index: number, results: readonly unknown[] | undefined) {
  const listRef = useListRef(null);
  const indexRef = useLatest(index);
  const [listMeasurements, setListMeasurements] = useState(0);

  const handleResize = useCallback((_size: ListSize, previousSize: ListSize) => {
    const isFirstMeasurement = previousSize.height === 0;

    if (isFirstMeasurement) {
      setListMeasurements((count) => count + 1);
    }
  }, []);

  useEffect(() => {
    listRef.current?.scrollToRow({
      align: 'center',
      behavior: 'instant',
      index: indexRef.current,
    });
  }, [indexRef, listMeasurements, listRef, results]);

  return { handleResize, listRef };
}
