import { NULL_VALUE } from './constants';

export const parseValue = (value: string): 'left' | 'right' | null => {
  if (value === 'left' || value === 'right') {
    return value;
  }

  if (value === NULL_VALUE) {
    return null;
  }

  throw new Error(`"${value}" is not valid. Should be "left", "right", or "${NULL_VALUE}"`);
};
