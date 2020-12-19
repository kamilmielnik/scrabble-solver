import { WordDefinitionJson } from '@scrabble-solver/models';

import { Locale } from 'types';

interface Payload {
  locale: Locale;
  word: string;
}

const findWordDefinition = async ({ locale, word }: Payload): Promise<WordDefinitionJson> => {
  const url = `${process.env.REACT_APP_API_URL}/dictionary/${locale}/${word}`;
  const json = await fetch(url).then((response) => response.json());
  return json;
};

export default findWordDefinition;
