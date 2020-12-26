import { KeyboardEvent, KeyboardEventHandler } from 'react';

import noop from './noop';

interface Parameters {
  onArrowDown?: KeyboardEventHandler;
  onArrowLeft?: KeyboardEventHandler;
  onArrowRight?: KeyboardEventHandler;
  onArrowUp?: KeyboardEventHandler;
  onBackspace?: KeyboardEventHandler;
  onDelete?: KeyboardEventHandler;
  onEnter?: KeyboardEventHandler;
  onKeyDown?: KeyboardEventHandler;
}

const createKeyboardNavigation = ({
  onArrowDown = noop,
  onArrowLeft = noop,
  onArrowRight = noop,
  onArrowUp = noop,
  onBackspace = noop,
  onDelete = noop,
  onEnter = noop,
  onKeyDown = noop,
}: Parameters) => {
  const handlers: Record<string, KeyboardEventHandler> = {
    ArrowUp: onArrowUp,
    ArrowDown: onArrowDown,
    ArrowLeft: onArrowLeft,
    ArrowRight: onArrowRight,
    Backspace: onBackspace,
    Delete: onDelete,
    Enter: onEnter,
  };

  return (event: KeyboardEvent) => {
    const handler = handlers[event.key] || noop;
    handler(event);
    onKeyDown(event);
  };
};

export default createKeyboardNavigation;
