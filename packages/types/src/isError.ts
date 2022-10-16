import isObject from './isObject';

const isError = (value: unknown): value is Error => {
  if (!isObject(value)) {
    return false;
  }

  return typeof value.message === 'string';
};

export default isError;
