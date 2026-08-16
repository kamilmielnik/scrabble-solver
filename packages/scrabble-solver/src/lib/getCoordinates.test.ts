import { getCoordinates } from './getCoordinates';

describe('getCoordinates', () => {
  const point = { x: 3, y: 5 };

  it('encodes a horizontal word as row number followed by column letter in original mode', () => {
    expect(getCoordinates({ ...point, isHorizontal: true }, 'original')).toBe('6D');
  });

  it('encodes a vertical word as column letter followed by row number in original mode', () => {
    expect(getCoordinates({ ...point, isHorizontal: false }, 'original')).toBe('D6');
  });

  it('encodes a horizontal word as row letter followed by column number in alternative mode', () => {
    expect(getCoordinates({ ...point, isHorizontal: true }, 'alternative')).toBe('F4');
  });

  it('encodes a vertical word as column number followed by row letter in alternative mode', () => {
    expect(getCoordinates({ ...point, isHorizontal: false }, 'alternative')).toBe('4F');
  });
});
