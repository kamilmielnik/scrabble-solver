import { type FocusEvent, type MouseEvent, useMemo } from 'react';

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
 * the keyboard-focused row, and when focus leaves the list, to the hovered row.
 * `rows` are the rows of the list, in the order of the `index` of their `Row`.
 */
export function usePointerHighlight<T>(rows: T[], highlight: (row: T | null) => void): PointerHighlight<T> {
  const rowsRef = useLatest(rows);

  return useMemo(() => {
    function findRow(list: Element, state: ':focus-visible' | ':hover'): T | null {
      const element = list.querySelector<HTMLElement>(`${ROW_SELECTOR}${state}`);

      return element ? (rowsRef.current[Number(element.dataset.rowIndex)] ?? null) : null;
    }

    return {
      onListMouseLeave: (event: MouseEvent) => {
        highlight(findRow(event.currentTarget, ':focus-visible'));
      },
      onRowBlur: (event: FocusEvent) => {
        const list = event.currentTarget.closest('[role="list"]');
        const nextFocused = event.relatedTarget;
        const isFocusMovingToAnotherRow =
          nextFocused instanceof Element && nextFocused.matches(ROW_SELECTOR) && Boolean(list?.contains(nextFocused));

        if (list && !isFocusMovingToAnotherRow) {
          highlight(findRow(list, ':hover'));
        }
      },
      onRowFocus: (row: T) => {
        highlight(row);
      },
      onRowMouseEnter: (row: T) => {
        highlight(row);
      },
    };
  }, [highlight, rowsRef]);
}
