import { http, https } from 'follow-redirects';
import { type IncomingMessage } from 'http';

import { DOWNLOAD_TIMEOUT_MS } from '../constants';

export function getResponse(url: string): Promise<IncomingMessage> {
  const protocol = url.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    protocol.get(url, { signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) }, resolve).on('error', reject);
  });
}
