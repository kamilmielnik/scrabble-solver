import fs from 'fs';

import { downloadFile, extractWords, getTempFilepath, unzip } from './lib';

const FILE_URL = 'https://dexonline.ro/static/download/scrabble/loc-flexiuni-5.0.zip';
const FILE_TO_EXTRACT_FROM_ZIP = 'loc-flexiuni-5.0.txt';

const getRoRoWordList = async (): Promise<string[]> => {
  const tempFilepath = getTempFilepath();
  const zipTempFilename = await downloadFile(FILE_URL);
  await unzip(zipTempFilename, FILE_TO_EXTRACT_FROM_ZIP, tempFilepath);
  fs.unlinkSync(zipTempFilename);
  const file = fs.readFileSync(tempFilepath, 'utf-8');
  fs.unlinkSync(tempFilepath);
  const words = extractWords(replaceDiacritics(file.toLocaleString()), 'ro-RO');
  return words;
};

const replaceDiacritics = (file: string): string => {
  return file.replaceAll('ă', 'a').replaceAll('â', 'a').replaceAll('î', 'i').replaceAll('ș', 's').replaceAll('ț', 't');
};

export default getRoRoWordList;
