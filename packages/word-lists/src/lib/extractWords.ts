export const extractWords = (file: string, locale: string): string[] => {
  const words = file
    .split(/\r?\n/g)
    .map((line) => line.trim().toLocaleLowerCase(locale))
    .filter(Boolean);

  if (words.length === 0) {
    throw new Error('Cannot find any words in the file');
  }

  return words;
};
