import { type FocusEvent, useMemo, useRef } from 'react';

export interface PointerHighlight<T> {
  onListMouseLeave: () => void;
  onRowBlur: (event: FocusEvent) => void;
  onRowFocus: (row: T, event: FocusEvent) => void;
  onRowMouseEnter: (row: T) => void;
}

interface FocusedRow<T> {
  element: Element;
  row: T;
}

/**
 * Highlights the hovered or focused row. When the pointer leaves the list, the highlight goes back to
 * the keyboard-focused row. When focus leaves the list, the highlight stays only if the pointer picked it.
 */
export function usePointerHighlight<T>(highlight: (row: T | null) => void): PointerHighlight<T> {
  const focusedRowRef = useRef<FocusedRow<T> | null>(null);
  const isPickedByPointerRef = useRef(false);

  return useMemo(() => {
    function findKeyboardFocusedRow(): T | null {
      const focusedRow = focusedRowRef.current;

      return focusedRow?.element.matches(':focus-visible') ? focusedRow.row : null;
    }

    function pick(row: T | null, isPickedByPointer: boolean) {
      isPickedByPointerRef.current = isPickedByPointer;
      highlight(row);
    }

    return {
      onListMouseLeave: () => {
        pick(findKeyboardFocusedRow(), false);
      },
      onRowBlur: (event: FocusEvent) => {
        const list = event.currentTarget.closest('[role="list"]');
        const nextFocused = event.relatedTarget;
        const isFocusMovingToAnotherRow = nextFocused instanceof Element && Boolean(list?.contains(nextFocused));

        focusedRowRef.current = null;

        if (!isFocusMovingToAnotherRow && !isPickedByPointerRef.current) {
          pick(null, false);
        }
      },
      onRowFocus: (row: T, event: FocusEvent) => {
        focusedRowRef.current = { element: event.currentTarget, row };
        pick(row, false);
      },
      onRowMouseEnter: (row: T) => {
        pick(row, true);
      },
    };
  }, [highlight]);
}
