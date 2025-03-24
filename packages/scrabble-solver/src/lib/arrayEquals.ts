export const arrayEquals = <T>(array1: T[], array2: T[]): boolean => {
  return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
};
