import { getNextCellFilter } from './lib';

describe('getNextCellFilter', () => {
  it('offers to include a cell with no filter', () => {
    expect(getNextCellFilter(undefined).labelTranslationKey).toBe('cell.filter-cell.include');
  });

  it('offers to exclude an included cell', () => {
    expect(getNextCellFilter({ type: 'include', x: 0, y: 0 }).labelTranslationKey).toBe('cell.filter-cell.exclude');
  });

  it('offers to clear an excluded cell', () => {
    expect(getNextCellFilter({ type: 'exclude', x: 0, y: 0 }).labelTranslationKey).toBe('common.clear');
  });

  it('uses a different icon per step', () => {
    const icons = [
      getNextCellFilter(undefined).Icon,
      getNextCellFilter({ type: 'include', x: 0, y: 0 }).Icon,
      getNextCellFilter({ type: 'exclude', x: 0, y: 0 }).Icon,
    ];

    expect(new Set(icons).size).toBe(3);
  });
});
