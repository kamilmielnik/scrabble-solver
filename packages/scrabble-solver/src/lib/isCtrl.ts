import { KeyboardEvent } from 'react';

const isCtrl = <T>(event: KeyboardEvent<T> | globalThis.KeyboardEvent): boolean => {
  return event.ctrlKey || event.metaKey;
};

export default isCtrl;
