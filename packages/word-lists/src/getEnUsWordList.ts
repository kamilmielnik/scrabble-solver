import { getTxtWordList } from './lib';

const FILE_URL = 'https://www.wordgamedictionary.com/twl06/download/twl06.txt';

const getEnUsWordList = async (): Promise<string[]> => {
  return getTxtWordList(FILE_URL);
};

export default getEnUsWordList;
