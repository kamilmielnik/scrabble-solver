import { generateVectors } from './generateVectors';

describe('generateVectors', () => {
  it('generates given number of vectors', () => {
    const vectors = generateVectors({
      getNthVector: () => [],
      vectorsCount: 3,
    });
    expect(vectors.length).toBe(3);
    expect(vectors).toEqual([[], [], []]);
  });
});
