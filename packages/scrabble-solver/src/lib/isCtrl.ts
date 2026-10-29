import { type KeyboardEvent } from 'react';

export const isCtrl = <T>(event: globalThis.KeyboardEvent | KeyboardEvent<T>): boolean => {
  return event.ctrlKey || event.metaKey;
};
