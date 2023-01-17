import findFirstWordIndex from './findFirstWordIndex';

const extractWords = (file: string, locale: string): string[] => {
  const lines = file.split(/\r?\n/g);
  const firstWordIndex = findFirstWordIndex(lines, locale);
  const words: string[] = [];

  for (let i = firstWordIndex; i < lines.length; ++i) {
    const trimmed = lines[i].trim();

    if (trimmed.length > 0) {
      words.push(trimmed.toLocaleLowerCase());
    }
  }

  return words;
};

export default extractWords;
