const createNullMovingComparator = <T>(direction: 'left' | 'right') => {
  return (a: T | null, b: T | null): number => {
    if (a === b) {
      return 0;
    }

    if (a === null) {
      return direction === 'right' ? 1 : -1;
    }

    if (b === null) {
      return direction === 'right' ? -1 : 1;
    }

    return 0;
  };
};

export default createNullMovingComparator;
