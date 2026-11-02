import { type FocusEvent, useEffect, useMemo, useRef } from 'react';

import { isKeyboardFocused } from '@/lib/isKeyboardFocused';

export interface PointerHighlight<T> {
  onListMouseLeave: () => void;
  onRowBlur: () => void;
  onRowFocus: (row: T, event: FocusEvent) => void;
  onRowMouseEnter: (row: T) => void;
}

/**
 * Highlights the hovered row, or the keyboard-focused row while no row is hovered.
 * Both are forgotten when the rows change, so that a row of an earlier list is never highlighted.
 */
export const usePointerHighlight = <T>(
  rows: readonly T[] | undefined,
  highlight: (row: T | null) => void,
): PointerHighlight<T> => {
  const hoveredRowRef = useRef<T | null>(null);
  const keyboardFocusedRowRef = useRef<T | null>(null);

  useEffect(() => {
    hoveredRowRef.current = null;
    keyboardFocusedRowRef.current = null;
  }, [rows]);

  return useMemo(() => {
    const highlightHoveredOrKeyboardFocusedRow = () => {
      highlight(hoveredRowRef.current ?? keyboardFocusedRowRef.current);
    };

    return {
      onListMouseLeave: () => {
        hoveredRowRef.current = null;
        highlightHoveredOrKeyboardFocusedRow();
      },
      onRowBlur: () => {
        keyboardFocusedRowRef.current = null;
        highlightHoveredOrKeyboardFocusedRow();
      },
      onRowFocus: (row: T, event: FocusEvent) => {
        keyboardFocusedRowRef.current = isKeyboardFocused(event.target) ? row : null;
        highlightHoveredOrKeyboardFocusedRow();
      },
      onRowMouseEnter: (row: T) => {
        hoveredRowRef.current = row;
        highlightHoveredOrKeyboardFocusedRow();
      },
    };
  }, [highlight]);
};
