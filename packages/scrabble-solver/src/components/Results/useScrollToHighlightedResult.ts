import { type Result } from '@scrabble-solver/types';
import { type RefObject, useCallback, useEffect, useState } from 'react';
import { type ListImperativeAPI } from 'react-window';

import { useLatest } from '@/hooks/useLatest';

type ListResizeHandler = (size: unknown, previousSize: { height: number }) => void;

/**
 * Centers the highlighted result, or the first one, whenever the results change.
 * react-window centers a row within its measured height, which it does not know until its first resize,
 * so the returned handler has to be the list's `onResize`.
 */
export function useScrollToHighlightedResult(
  listRef: RefObject<ListImperativeAPI | null>,
  highlightedIndex: number | undefined,
  results: Result[] | undefined,
): ListResizeHandler {
  const [measuredList, setMeasuredList] = useState<HTMLDivElement | null>(null);
  const scrollToIndexRef = useLatest(typeof highlightedIndex === 'number' ? highlightedIndex : 0);

  useEffect(() => {
    const listElement = listRef.current?.element;
    const isListMeasured = Boolean(listElement) && listElement === measuredList;

    if (isListMeasured) {
      listRef.current?.scrollToRow({ align: 'center', behavior: 'instant', index: scrollToIndexRef.current });
    }
  }, [results, listRef, measuredList, scrollToIndexRef]);

  return useCallback<ListResizeHandler>(
    (_size, previousSize) => {
      const isFirstMeasurement = previousSize.height === 0;

      if (isFirstMeasurement) {
        setMeasuredList(listRef.current?.element ?? null);
      }
    },
    [listRef],
  );
}
