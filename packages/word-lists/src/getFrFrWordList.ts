import { getTxtWordList } from './lib';

const FILE_URL = 'https://raw.githubusercontent.com/hbenbel/French-Dictionary/master/dictionary/dictionary.txt';

const getFrFrWordList = async (): Promise<string[]> => {
  const words = await getTxtWordList(FILE_URL);
  return words.map(normalizeWord);
};

const normalizeWord = (word: string): string => {
  // normalization from https://stackoverflow.com/a/37511463
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export default getFrFrWordList;
