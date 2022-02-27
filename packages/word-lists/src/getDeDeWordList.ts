import { getTxtWordList } from './lib';

const FILE_URL = 'https://raw.githubusercontent.com/HanSolo80/German-Dictionary/master/dictionary.txt';

const getDeDeWordList = async (): Promise<string[]> => {
  return getTxtWordList(FILE_URL);
};

export default getDeDeWordList;
