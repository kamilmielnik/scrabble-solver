import findFirstWordIndex from './findFirstWordIndex';

const extractWords = (file: string): string[] => {
  const lines = file.replace(/\r/g, '').split('\n');
  const firstWordIndex = findFirstWordIndex(lines);
  const words = lines
    .slice(firstWordIndex)
    .filter((word) => word.trim().length > 0)
    .map((word) => word.toLocaleLowerCase());
  return words;
};

export default extractWords;
