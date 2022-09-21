import { getTxtWordList } from './lib';

const FILE_URL =
  // eslint-disable-next-line max-len
  'https://raw.githubusercontent.com/hbenbel/French-Dictionary/a573eab10cc798d7d5da7daab4d2ac0259bb46a3/dictionary/dictionary.txt';

const getFrFrWordList = async (): Promise<string[]> => {
  const words = await getTxtWordList(FILE_URL);
  return words.map(normalizeWord);
};

const normalizeWord = (word: string): string => {
  // normalization from https://stackoverflow.com/a/37511463
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export default getFrFrWordList;
