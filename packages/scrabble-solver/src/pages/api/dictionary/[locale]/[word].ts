import { WordDefinition } from '@scrabble-solver/models';
import { NextApiRequest, NextApiResponse } from 'next';

import { validateLocale, validateWord, translateEn, translatePl } from 'api';
import { Locale } from 'types';

const localeTranslate: Record<Locale, (word: string) => Promise<WordDefinition>> = {
  'en-GB': translateEn,
  'en-US': translateEn,
  'pl-PL': translatePl,
};

const dictionary = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  try {
    const { locale, word } = parseRequest(request);
    const translate = localeTranslate[locale];
    const result = await translate(word);
    response.status(200).send(result.toJson());
  } catch (error) {
    response.status(500).send('Server error');
  }
};

const parseRequest = (request: NextApiRequest): { locale: Locale; word: string } => {
  const { locale, word } = request.query;

  validateLocale(locale);
  validateWord(word);

  return {
    locale: locale as Locale,
    word: word as string,
  };
};

export default dictionary;
