import { type Result } from '@scrabble-solver/types';
import { type RefObject, useCallback, useEffect, useState } from 'react';
import { type ListImperativeAPI, type ListProps } from 'react-window';

import { useLatest } from '@/hooks/useLatest';

import { type ResultData } from './types';

type ListResizeHandler = NonNullable<ListProps<ResultData>['onResize']>;

/**
 * Centers the highlighted result, or the first one, whenever the results change or the list is shown again.
 * Where the highlight does not follow the pointer, it also centers a result that becomes highlighted out of view.
 * react-window centers a row within its measured height, which it does not know until the list is shown,
 * so the returned handler has to be the list's `onResize`.
 */
export function useScrollToHighlightedResult(
  listRef: RefObject<ListImperativeAPI | null>,
  highlightedIndex: number | undefined,
  results: Result[] | undefined,
  highlightFollowsPointer: boolean,
): ListResizeHandler {
  const [shownList, setShownList] = useState<WeakRef<HTMLDivElement> | null>(null);
  const shownListRef = useLatest(shownList);
  const scrollToIndexRef = useLatest(typeof highlightedIndex === 'number' ? highlightedIndex : 0);

  useEffect(() => {
    if (isShown(listRef.current?.element, shownList)) {
      listRef.current?.scrollToRow({ align: 'center', behavior: 'instant', index: scrollToIndexRef.current });
    }
  }, [results, listRef, shownList, scrollToIndexRef]);

  useEffect(() => {
    const listElement = listRef.current?.element;

    if (
      !highlightFollowsPointer &&
      typeof highlightedIndex === 'number' &&
      isShown(listElement, shownListRef.current) &&
      !isHighlightedRowInView(listElement)
    ) {
      listRef.current?.scrollToRow({ align: 'center', behavior: 'instant', index: highlightedIndex });
    }
  }, [highlightFollowsPointer, highlightedIndex, listRef, shownListRef]);

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

function isShown(
  listElement: HTMLDivElement | null | undefined,
  shownList: WeakRef<HTMLDivElement> | null,
): listElement is HTMLDivElement {
  return Boolean(listElement) && listElement === shownList?.deref();
}

/**
 * react-window may still render the rows of the previous scroll position, so a rendered row can be out of view.
 */
function isHighlightedRowInView(listElement: HTMLDivElement): boolean {
  const row = listElement.querySelector('[aria-current="true"]');

  if (!row) {
    return false;
  }

  const rowBox = row.getBoundingClientRect();
  const listBox = listElement.getBoundingClientRect();

  return rowBox.bottom > listBox.top && rowBox.top < listBox.bottom;
}
