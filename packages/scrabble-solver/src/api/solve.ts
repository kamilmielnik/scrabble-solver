import { BoardJson, ConfigJson, ResultJson } from '@scrabble-solver/models';

import { Locale } from 'types';

interface Payload {
  board: BoardJson;
  characters: string[];
  config: ConfigJson;
  locale: Locale;
}

const solve = async ({ board, characters, config, locale }: Payload): Promise<ResultJson[]> => {
  const url = '/api/solve';
  const json = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ board, characters, config, locale }),
  }).then((response) => response.json());
  return json;
};

export default solve;
