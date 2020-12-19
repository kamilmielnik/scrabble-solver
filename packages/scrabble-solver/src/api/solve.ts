import { BoardJson, ConfigJson, ResultJson } from '@scrabble-solver/models';

interface Payload {
  board: BoardJson;
  characters: string;
  config: ConfigJson;
  locale: 'en-GB' | 'en-US' | 'pl-PL';
}

const solve = async ({ board, characters, config, locale }: Payload): Promise<ResultJson[]> => {
  const url = `/api/solve`;
  const json = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ board, characters, config, locale })
  }).then((response) => response.json());
  return json;
};

export default solve;
