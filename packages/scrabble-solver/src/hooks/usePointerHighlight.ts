import { type MouseEvent, useMemo } from 'react';

import { useLatest } from '@/hooks/useLatest';

export interface PointerHighlight<T> {
  onListMouseLeave: (event: MouseEvent) => void;
  onRowBlur: () => void;
  onRowFocus: (row: T) => void;
  onRowMouseEnter: (row: T) => void;
}

/**
 * Highlights the hovered or focused row. When the pointer leaves the list, the highlight goes back to
 * the keyboard-focused row. `rows` are the rows of the list, in the order of the `index` of their `Row`.
 */
export function usePointerHighlight<T>(rows: T[], highlight: (row: T | null) => void): PointerHighlight<T> {
  const rowsRef = useLatest(rows);

  return useMemo(() => {
    function findKeyboardFocusedRow(list: Element): T | null {
      const element = list.querySelector<HTMLElement>('[data-row-index]:focus-visible');

      return element ? (rowsRef.current[Number(element.dataset.rowIndex)] ?? null) : null;
    }

    return {
      onListMouseLeave: (event: MouseEvent) => {
        highlight(findKeyboardFocusedRow(event.currentTarget));
      },
      onRowBlur: () => {
        highlight(null);
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
