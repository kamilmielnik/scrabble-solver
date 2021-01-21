import { fs } from 'memfs';

import getHash from './getHash';
import downloadFile from './downloadFile';
import extractWords from './extractWords';

const getTxtWordList = async (url: string): Promise<string[]> => {
  const tempFilename = getHash();
  await downloadFile(url, fs.createWriteStream(tempFilename));
  const file = fs.readFileSync(tempFilename, 'utf-8');
  const words = extractWords(file.toString());
  fs.unlinkSync(tempFilename);
  return words;
};

export default getTxtWordList;
