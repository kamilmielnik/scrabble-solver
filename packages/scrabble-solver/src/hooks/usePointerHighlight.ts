import { type FocusEvent, type MouseEvent, useMemo, useRef } from 'react';

export interface PointerHighlight<T> {
  onListMouseLeave: () => void;
  onListMouseMove: (event: MouseEvent) => void;
  onRowBlur: (event: FocusEvent) => void;
  onRowFocus: (row: T, event: FocusEvent) => void;
  onRowMouseEnter: (row: T, event: MouseEvent) => void;
}

interface FocusedRow<T> {
  element: Element;
  row: T;
}

interface PointerPosition {
  x: number;
  y: number;
}

/**
 * Highlights the hovered or focused row. A row that only scrolled under a pointer that did not move is not hovered.
 * When the pointer leaves the list, the highlight goes back to the keyboard-focused row.
 * When focus leaves the list, the highlight stays only if the pointer picked it.
 */
export function usePointerHighlight<T>(highlight: (row: T | null) => void): PointerHighlight<T> {
  const focusedRowRef = useRef<FocusedRow<T> | null>(null);
  const pointerPositionRef = useRef<PointerPosition | null>(null);
  const isPickedByPointerRef = useRef(false);

  return useMemo(() => {
    function findKeyboardFocusedRow(): T | null {
      const focusedRow = focusedRowRef.current;

      return focusedRow?.element.matches(':focus-visible') ? focusedRow.row : null;
    }

    function hasPointerMoved(event: MouseEvent): boolean {
      const position = pointerPositionRef.current;

      return !position || position.x !== event.clientX || position.y !== event.clientY;
    }

    function pick(row: T | null, isPickedByPointer: boolean) {
      isPickedByPointerRef.current = isPickedByPointer;
      highlight(row);
    }

    return {
      onListMouseLeave: () => {
        pointerPositionRef.current = null;
        pick(findKeyboardFocusedRow(), false);
      },
      onListMouseMove: (event: MouseEvent) => {
        pointerPositionRef.current = { x: event.clientX, y: event.clientY };
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
      onRowMouseEnter: (row: T, event: MouseEvent) => {
        if (hasPointerMoved(event)) {
          pick(row, true);
        }
      },
    };
  }, [highlight]);
}
