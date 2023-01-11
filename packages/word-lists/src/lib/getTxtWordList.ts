import fs from 'fs';

import downloadFile from './downloadFile';
import extractWords from './extractWords';

const getTxtWordList = async (url: string): Promise<string[]> => {
  const tempFilename = await downloadFile(url);
  const file = fs.readFileSync(tempFilename, 'utf-8');
  const words = extractWords(file.toLocaleString());
  fs.unlinkSync(tempFilename);
  return words;
};

export default getTxtWordList;
