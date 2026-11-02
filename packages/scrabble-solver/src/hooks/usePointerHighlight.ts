import { type FocusEvent, type MouseEvent, useMemo, useRef } from 'react';

import { useLatest } from '@/hooks/useLatest';

const ROW_SELECTOR = '[data-row-index]';

export interface PointerHighlight<T> {
  onListMouseLeave: (event: MouseEvent) => void;
  onRowBlur: (event: FocusEvent) => void;
  onRowFocus: (row: T) => void;
  onRowMouseEnter: (row: T) => void;
}

/**
 * Highlights the hovered or focused row. When the pointer leaves the list, the highlight goes back to
 * the keyboard-focused row. When focus leaves the list, the highlight stays only if the pointer picked it.
 * `rows` are the rows of the list, in the order of the `index` of their `Row`.
 */
export function usePointerHighlight<T>(rows: T[], highlight: (row: T | null) => void): PointerHighlight<T> {
  const rowsRef = useLatest(rows);
  const isPickedByPointerRef = useRef(false);

  return useMemo(() => {
    function findFocusedRow(list: Element): T | null {
      const element = list.querySelector<HTMLElement>(`${ROW_SELECTOR}:focus-visible`);

      return element ? (rowsRef.current[Number(element.dataset.rowIndex)] ?? null) : null;
    }

    function pick(row: T | null, isPickedByPointer: boolean) {
      isPickedByPointerRef.current = isPickedByPointer;
      highlight(row);
    }

    return {
      onListMouseLeave: (event: MouseEvent) => {
        pick(findFocusedRow(event.currentTarget), false);
      },
      onRowBlur: (event: FocusEvent) => {
        const list = event.currentTarget.closest('[role="list"]');
        const nextFocused = event.relatedTarget;
        const isFocusMovingToAnotherRow =
          nextFocused instanceof Element && nextFocused.matches(ROW_SELECTOR) && Boolean(list?.contains(nextFocused));

        if (!isFocusMovingToAnotherRow && !isPickedByPointerRef.current) {
          pick(null, false);
        }
      },
      onRowFocus: (row: T) => {
        pick(row, false);
      },
      onRowMouseEnter: (row: T) => {
        pick(row, true);
      },
    };
  }, [highlight, rowsRef]);
}
