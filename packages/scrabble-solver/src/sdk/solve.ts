import { BoardJson, Locale, ResultJson } from '@scrabble-solver/types';

interface Payload {
  board: BoardJson;
  characters: string[];
  configId: string;
  locale: Locale;
}

const solve = ({ board, characters, configId, locale }: Payload): Promise<ResultJson[]> => {
  return fetch('/api/solve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ board, characters, configId, locale }),
  }).then((response) => response.json());
};

export default solve;
