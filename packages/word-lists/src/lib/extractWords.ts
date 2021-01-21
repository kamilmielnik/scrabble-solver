import findFirstWordIndex from './findFirstWordIndex';

const extractWords = (file: string): string[] => {
  const lines = file.replace(/\r/g, '').split('\n');
  const firstWordIndex = findFirstWordIndex(lines);
  const words = lines.slice(firstWordIndex).filter(Boolean);
  return words;
};

export default extractWords;
