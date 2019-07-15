export const noop = () => undefined;
export const reverseComparator = (comparator) => (a, b) => -comparator(a, b);
export const createKeyComparator = (key) => (a, b) => {
  const aValue = a[key];
  const bValue = b[key];
  const compare = typeof aValue === 'string' ? stringsComparator : numbersComparator;
  return compare(aValue, bValue);
};
const stringsComparator = (a, b) => a.localeCompare(b);
const numbersComparator = (a, b) => a - b;

export const createKeyboardNavigation = ({
  onArrowDown = noop,
  onArrowLeft = noop,
  onArrowRight = noop,
  onArrowUp = noop,
  onBackspace = noop,
  onDelete = noop,
  onEnter = noop,
  onKeyDown = noop
}) => {
  const handlers = {
    ArrowUp: onArrowUp,
    ArrowDown: onArrowDown,
    ArrowLeft: onArrowLeft,
    ArrowRight: onArrowRight,
    Backspace: onBackspace,
    Delete: onDelete,
    Enter: onEnter
  };

  return (event) => {
    const handler = handlers[event.key] || noop;
    handler(event);
    onKeyDown(event);
  };
};
