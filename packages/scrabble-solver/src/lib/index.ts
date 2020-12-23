import { Comparator } from 'types';

export const noop = (): void => undefined;

export const reverseComparator = <T>(comparator: Comparator<T>): Comparator<T> => (a: T, b: T): number =>
  -comparator(a, b);

export const createKeyComparator = <T extends Record<keyof T, unknown>>(key: keyof T): Comparator<T> => {
  return (a: T, b: T): number => {
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return stringsComparator(aValue, bValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return numbersComparator(aValue, bValue);
    }

    return 0;
  };
};

const stringsComparator: Comparator<string> = (a, b) => a.localeCompare(b);

const numbersComparator: Comparator<number> = (a, b) => a - b;

// export const createKeyboardNavigation = ({
//   onArrowDown = noop,
//   onArrowLeft = noop,
//   onArrowRight = noop,
//   onArrowUp = noop,
//   onBackspace = noop,
//   onDelete = noop,
//   onEnter = noop,
//   onKeyDown = noop,
// }) => {
//   const handlers = {
//     ArrowUp: onArrowUp,
//     ArrowDown: onArrowDown,
//     ArrowLeft: onArrowLeft,
//     ArrowRight: onArrowRight,
//     Backspace: onBackspace,
//     Delete: onDelete,
//     Enter: onEnter,
//   };

//   return (event) => {
//     const handler = handlers[event.key] || noop;
//     handler(event);
//     onKeyDown(event);
//   };
// };

export { default as detectLocale } from './detectLocale';
export { default as isLocale } from './isLocale';
