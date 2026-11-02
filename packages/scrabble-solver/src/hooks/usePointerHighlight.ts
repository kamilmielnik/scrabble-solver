import { type FocusEvent, useMemo, useRef } from 'react';

import { isKeyboardFocused } from '@/lib/isKeyboardFocused';

export interface PointerHighlight<T> {
  onListMouseLeave: () => void;
  onRowBlur: () => void;
  onRowFocus: (row: T, event: FocusEvent) => void;
  onRowMouseEnter: (row: T) => void;
}

/**
 * Highlights the hovered or focused row. When the pointer leaves the list, the highlight goes back to
 * the keyboard-focused row.
 */
export const usePointerHighlight = <T>(highlight: (row: T | null) => void): PointerHighlight<T> => {
  const keyboardFocusedRowRef = useRef<T | null>(null);

  return useMemo(
    () => ({
      onListMouseLeave: () => {
        highlight(keyboardFocusedRowRef.current);
      },
      onRowBlur: () => {
        keyboardFocusedRowRef.current = null;
        highlight(null);
      },
      onRowFocus: (row: T, event: FocusEvent) => {
        keyboardFocusedRowRef.current = isKeyboardFocused(event.target) ? row : null;
        highlight(row);
      },
      onRowMouseEnter: (row: T) => {
        highlight(row);
      },
    }),
    [highlight],
  );
};
