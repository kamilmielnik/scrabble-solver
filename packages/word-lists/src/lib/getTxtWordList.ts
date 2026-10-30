import fs from 'fs';

import { downloadFile } from './downloadFile';
import { extractWords } from './extractWords';

export const getTxtWordList = async (url: string, locale: string): Promise<string[]> => {
  const tempFilename = await downloadFile(url);

  try {
    const file = fs.readFileSync(tempFilename, 'utf-8');
    return extractWords(file.toLocaleString(), locale);
  } finally {
    fs.rmSync(tempFilename, { force: true });
  }
};
