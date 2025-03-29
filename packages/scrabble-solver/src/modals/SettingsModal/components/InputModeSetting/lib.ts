import { type InputMode } from 'types';

export const parseValue = (value: string): InputMode => {
  if (value === 'keyboard') {
    return 'keyboard';
  }

  if (value === 'touchscreen') {
    return 'touchscreen';
  }

  throw new Error(`"${value}" is not valid. Should be "keyboard" or "touchscreen"`);
};
