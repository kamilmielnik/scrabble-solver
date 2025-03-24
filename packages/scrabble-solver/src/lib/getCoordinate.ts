const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const getCoordinate = (index: number, type: 'letter' | 'number'): string => {
  if (type === 'number') {
    return String(index + 1);
  }

  return alphabet[index];
};
