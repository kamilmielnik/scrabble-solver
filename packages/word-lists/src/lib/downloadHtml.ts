import { text } from 'stream/consumers';

import { getResponse } from './getResponse';

export async function downloadHtml(url: string): Promise<string> {
  return text(await getResponse(url));
}
