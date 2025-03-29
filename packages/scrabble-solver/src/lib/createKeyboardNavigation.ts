import { type KeyboardEventHandler } from 'react';

import { noop } from './noop';

interface Parameters {
  onArrowDown?: KeyboardEventHandler<HTMLInputElement>;
  onArrowLeft?: KeyboardEventHandler<HTMLInputElement>;
  onArrowRight?: KeyboardEventHandler<HTMLInputElement>;
  onArrowUp?: KeyboardEventHandler<HTMLInputElement>;
  onBackspace?: KeyboardEventHandler<HTMLInputElement>;
  onDelete?: KeyboardEventHandler<HTMLInputElement>;
  onEnter?: KeyboardEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onSpace?: KeyboardEventHandler<HTMLInputElement>;
}

export const createKeyboardNavigation = ({
  onArrowDown = noop,
  onArrowLeft = noop,
  onArrowRight = noop,
  onArrowUp = noop,
  onBackspace = noop,
  onDelete = noop,
  onEnter = noop,
  onKeyDown = noop,
  onSpace = noop,
}: Parameters): KeyboardEventHandler<HTMLInputElement> => {
  const handlers: Record<string, KeyboardEventHandler<HTMLInputElement>> = {
    ArrowUp: onArrowUp,
    ArrowDown: onArrowDown,
    ArrowLeft: onArrowLeft,
    ArrowRight: onArrowRight,
    Backspace: onBackspace,
    Delete: onDelete,
    Enter: onEnter,
    ' ': onSpace,
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    const handler = handlers[event.key] || noop;
    handler(event);
    onKeyDown(event);
  };

  return handleKeyDown;
};
