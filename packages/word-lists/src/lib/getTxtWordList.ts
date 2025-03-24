import fs from 'fs';

import { downloadFile } from './downloadFile';
import { extractWords } from './extractWords';

export const getTxtWordList = async (url: string, locale: string): Promise<string[]> => {
  const tempFilename = await downloadFile(url);
  const file = fs.readFileSync(tempFilename, 'utf-8');
  const words = extractWords(file.toLocaleString(), locale);
  fs.unlinkSync(tempFilename);
  return words;
};
