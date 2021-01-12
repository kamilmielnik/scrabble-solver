import { KeyboardEvent } from 'react';

const isCtrl = <T>(event: KeyboardEvent<T>): boolean => {
  return event.ctrlKey || event.metaKey;
};

export default isCtrl;
