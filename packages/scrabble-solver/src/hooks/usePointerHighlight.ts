import { type FocusEvent, type MouseEvent, useMemo, useRef } from 'react';

export interface PointerHighlight<T> {
  onListMouseLeave: () => void;
  onRowBlur: (row: T, event: FocusEvent) => void;
  onRowFocus: (row: T, event: FocusEvent) => void;
  onRowMouseMove: (row: T, event: MouseEvent) => void;
}

interface FocusedRow<T> {
  element: Element;
  row: T;
}

interface Pointer<T> {
  row: T;
  x: number;
  y: number;
}

/**
 * Highlights the row that the pointer moves onto, or the focused row. A row that only scrolled under a pointer that
 * did not move is not picked. While nothing is highlighted, the pointer also picks the row it moves inside. When the
 * pointer leaves the list, the highlight goes back to the keyboard-focused row. When focus leaves the list,
 * the highlight stays only if the pointer picked it.
 */
export function usePointerHighlight<T>(highlight: (row: T | null) => void): PointerHighlight<T> {
  const focusedRowRef = useRef<FocusedRow<T> | null>(null);
  const pointerRef = useRef<Pointer<T> | null>(null);
  const isPickedByPointerRef = useRef(false);
  const isAnyRowHighlightedRef = useRef(false);

  return useMemo(() => {
    return {
      onListMouseLeave: () => {
        pointerRef.current = null;
        pick(findKeyboardFocusedRow(), false);
      },
      onRowBlur: (_row: T, event: FocusEvent) => {
        const list = event.currentTarget.closest('[role="list"]');
        const nextFocused = event.relatedTarget;
        const isFocusMovingToAnotherRow =
          nextFocused instanceof Element && nextFocused !== list && Boolean(list?.contains(nextFocused));

        focusedRowRef.current = null;

        if (!isFocusMovingToAnotherRow && !isPickedByPointerRef.current) {
          pick(null, false);
        }
      },
      onRowFocus: (row: T, event: FocusEvent) => {
        focusedRowRef.current = { element: event.currentTarget, row };
        pick(row, false);
      },
      onRowMouseMove: (row: T, event: MouseEvent) => {
        if (!hasPointerMoved(event)) {
          return;
        }

        const isNewRow = pointerRef.current?.row !== row;
        pointerRef.current = { row, x: event.clientX, y: event.clientY };

        if (isNewRow || !isAnyRowHighlightedRef.current) {
          pick(row, true);
        }
      },
    };

    function findKeyboardFocusedRow(): T | null {
      const focusedRow = focusedRowRef.current;

      return focusedRow?.element.matches(':focus-visible') ? focusedRow.row : null;
    }

    function hasPointerMoved(event: MouseEvent): boolean {
      const pointer = pointerRef.current;

      return !pointer || pointer.x !== event.clientX || pointer.y !== event.clientY;
    }

    function pick(row: T | null, isPickedByPointer: boolean) {
      isPickedByPointerRef.current = isPickedByPointer;
      isAnyRowHighlightedRef.current = row !== null;
      highlight(row);
    }
  }, [highlight]);
}
