import { BoardJson, ResultJson } from '@scrabble-solver/models';

import { Locale } from 'types';

const URL = '/api/solve';

interface Payload {
  board: BoardJson;
  characters: string[];
  configId: string;
  locale: Locale;
}

const solve = ({ board, characters, configId, locale }: Payload): Promise<ResultJson[]> => {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ board, characters, configId, locale }),
  }).then((response) => response.json());
};

export default solve;
