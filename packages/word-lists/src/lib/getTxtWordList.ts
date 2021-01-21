import { fs } from 'memfs';

import downloadFile from './downloadFile';
import extractWords from './extractWords';
import getTempFilename from './getTempFilename';

const getTxtWordList = async (url: string): Promise<string[]> => {
  const tempFilename = getTempFilename();
  await downloadFile(url, fs.createWriteStream(tempFilename));
  const file = fs.readFileSync(tempFilename, 'utf-8');
  const words = extractWords(file.toString());
  fs.unlinkSync(tempFilename);
  return words;
};

export default getTxtWordList;
