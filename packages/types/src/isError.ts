import { isObject } from './isObject';

export const isError = (value: unknown): value is Error => {
  if (!isObject(value)) {
    return false;
  }

  return typeof value.message === 'string';
};
