import type { KeyboardEvent } from 'react';

const isCtrl = <T>(event: globalThis.KeyboardEvent | KeyboardEvent<T>): boolean => {
  return event.ctrlKey || event.metaKey;
};

export default isCtrl;
