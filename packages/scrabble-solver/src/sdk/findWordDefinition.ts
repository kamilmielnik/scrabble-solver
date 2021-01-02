import { WordDefinition } from '@scrabble-solver/models';

import { Locale } from 'types';

interface Payload {
  locale: Locale;
  word: string;
}

const findWordDefinition = async ({ locale, word }: Payload): Promise<WordDefinition> => {
  const url = `/api/dictionary/${locale}/${word}`;
  const json = await fetch(url).then((response) => response.json());
  return WordDefinition.fromJson(json);
};

export default findWordDefinition;
