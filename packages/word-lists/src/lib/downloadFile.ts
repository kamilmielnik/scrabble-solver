import { http, https } from 'follow-redirects';
import fs from 'fs';
import { type IncomingMessage } from 'http';
import { pipeline } from 'stream/promises';

import { DOWNLOAD_TIMEOUT_MS } from '../constants';

import { getTempFilepath } from './getTempFilepath';

export async function downloadFile(url: string): Promise<string> {
  const tempFilepath = getTempFilepath();
  const response = await get(url);

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

function get(url: string): Promise<IncomingMessage> {
  const protocol = url.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    protocol.get(url, { signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) }, resolve).on('error', reject);
  });
}
