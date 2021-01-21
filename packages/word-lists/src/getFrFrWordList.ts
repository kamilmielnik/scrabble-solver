import { fs } from 'memfs';

import { downloadFile, extractWords } from './lib';

const FILE_URL = 'https://raw.githubusercontent.com/hbenbel/French-Dictionary/master/dictionary/dictionary.txt';
const TEMP_FILENAME = 'tmp.txt';

const getFrFrWordList = async (): Promise<string[]> => {
  await downloadFile(FILE_URL, fs.createWriteStream(TEMP_FILENAME));
  const file = fs.readFileSync(TEMP_FILENAME, 'utf-8');
  const words = extractWords(file.toString());
  fs.unlinkSync(TEMP_FILENAME);
  return words.map(normalize);
};

const normalize = (word: string): string => {
  // normalization from : https://stackoverflow.com/a/37511463
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export default getFrFrWordList;
