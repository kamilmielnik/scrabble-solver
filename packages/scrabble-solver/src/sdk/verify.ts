import { BoardJson, Locale } from '@scrabble-solver/types';

interface Payload {
  board: BoardJson;
  configId: string;
  locale: Locale;
}

interface Response {
  invalidWords: string[];
  validWords: string[];
}

const verify = ({ board, configId, locale }: Payload): Promise<Response> => {
  return fetch('/api/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ board, configId, locale }),
  }).then((response) => response.json());
};

export default verify;
