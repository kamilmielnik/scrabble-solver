import { type Result } from '@scrabble-solver/types';
import { type RefObject, useCallback, useEffect, useState } from 'react';
import { type ListImperativeAPI, type ListProps } from 'react-window';

import { useLatest } from '@/hooks/useLatest';

import { type ResultData } from './types';

type ListResizeHandler = NonNullable<ListProps<ResultData>['onResize']>;

/**
 * Centers the highlighted result, or the first one, whenever the results change or the list is shown again.
 * react-window centers a row within its measured height, which it does not know until the list is shown,
 * so the returned handler has to be the list's `onResize`.
 */
export function useScrollToHighlightedResult(
  listRef: RefObject<ListImperativeAPI | null>,
  highlightedIndex: number | undefined,
  results: Result[] | undefined,
): ListResizeHandler {
  const [shownList, setShownList] = useState<WeakRef<HTMLDivElement> | null>(null);
  const scrollToIndexRef = useLatest(typeof highlightedIndex === 'number' ? highlightedIndex : 0);

  useEffect(() => {
    const listElement = listRef.current?.element;
    const isListShown = Boolean(listElement) && listElement === shownList?.deref();

    if (isListShown) {
      listRef.current?.scrollToRow({ align: 'center', behavior: 'instant', index: scrollToIndexRef.current });
    }
  }, [results, listRef, shownList, scrollToIndexRef]);

  return useCallback<ListResizeHandler>(
    (size, previousSize) => {
      const listElement = listRef.current?.element;
      const isHidden = size.height === 0;
      const wasHidden = previousSize.height === 0;

      if (isHidden) {
        setShownList(null);
      } else if (wasHidden && listElement) {
        setShownList(new WeakRef(listElement));
      }
    },
    [listRef],
  );
}
