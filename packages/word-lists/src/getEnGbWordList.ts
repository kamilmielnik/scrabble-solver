import { fs } from 'memfs';

import { downloadFile, extractWords } from './lib';

const FILE_URL = 'https://www.wordgamedictionary.com/sowpods/download/sowpods.txt';
const TEMP_FILENAME = 'tmp.txt';

const getEnGbWordList = async (): Promise<string[]> => {
  await downloadFile(FILE_URL, fs.createWriteStream(TEMP_FILENAME));
  const file = fs.readFileSync(TEMP_FILENAME, 'utf-8');
  const words = extractWords(file.toString());
  fs.unlinkSync(TEMP_FILENAME);
  return words;
};

export default getEnGbWordList;
