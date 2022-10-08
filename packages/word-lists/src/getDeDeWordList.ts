import { getTxtWordList } from './lib';

const FILE_URL = 'https://raw.githubusercontent.com/enz/german-wordlist/master/words';

const getDeDeWordList = async (): Promise<string[]> => {
  return getTxtWordList(FILE_URL);
};

export default getDeDeWordList;
