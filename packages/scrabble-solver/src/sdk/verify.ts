import { BoardJson, Locale } from '@scrabble-solver/types';

import fetchJson from './fetchJson';

interface Payload {
  board: BoardJson;
  configId: string;
  locale: Locale;
}

interface Response {
  invalidWords: string[];
  validWords: string[];
}

const verify = async ({ board, configId, locale }: Payload): Promise<Response> => {
  return fetchJson<Response>('/api/solve', {
    method: 'POST',
    body: JSON.stringify({ board, configId, locale }),
  });
};

export default verify;
