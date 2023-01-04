import { getTxtWordList } from './lib';

const FILE_URL = 'https://raw.githubusercontent.com/hippler/german-wordlist/master/words.txt';

const getDeDeWordList = async (): Promise<string[]> => {
  return getTxtWordList(FILE_URL);
};

export default getDeDeWordList;
