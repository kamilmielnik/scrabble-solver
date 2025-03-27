const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const getCoordinate = (index: number, type: 'letter' | 'number'): string => {
  if (type === 'number') {
    return String(index + 1);
  }

  let result = '';
  let nextIndex = index;

  while (nextIndex >= 0) {
    result = alphabet[nextIndex % alphabet.length] + result;
    nextIndex = Math.floor(nextIndex / alphabet.length) - 1;
  }

  return result;
};
