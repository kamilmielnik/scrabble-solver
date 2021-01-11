import createNullMovingComparator from './createNullMovingComparator';

describe('createNullMovingComparator', () => {
  it('Moves nulls left', () => {
    const input = [null, 3, null, 2, null, 1, null];
    const comparator = createNullMovingComparator('left');
    expect([...input].sort(comparator)).toEqual([null, null, null, null, 3, 2, 1]);
  });

  it('Moves nulls right', () => {
    const input = [null, 3, null, 2, null, 1, null];
    const comparator = createNullMovingComparator('right');
    expect([...input].sort(comparator)).toEqual([3, 2, 1, null, null, null, null]);
  });
});
