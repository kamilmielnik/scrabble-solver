import { type KeyboardEvent } from 'react';

export const isCtrl = <T>(event: KeyboardEvent<T> | globalThis.KeyboardEvent): boolean => {
  return event.ctrlKey || event.metaKey;
};
