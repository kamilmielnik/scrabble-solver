import fs from 'fs';
import { pipeline } from 'stream/promises';

import { getResponse } from './getResponse';
import { getTempFilepath } from './getTempFilepath';

export async function downloadFile(url: string): Promise<string> {
  const tempFilepath = getTempFilepath();
  const response = await getResponse(url);

  if (typeof response.statusCode === 'undefined' || response.statusCode >= 400) {
    response.destroy();
    throw new Error(`Cannot download file: ${url}`);
  }

  try {
    await pipeline(response, fs.createWriteStream(tempFilepath));
    return tempFilepath;
  } catch (error) {
    fs.rmSync(tempFilepath, { force: true });
    throw error;
  }
}
