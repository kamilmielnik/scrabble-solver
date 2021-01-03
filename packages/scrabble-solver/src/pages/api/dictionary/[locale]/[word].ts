import { WordDefinition } from '@scrabble-solver/models';
import { NextApiRequest, NextApiResponse } from 'next';

import { validateLocale, validateWord, translateEn, translatePl } from 'api';
import { memoize } from 'lib';
import { Locale } from 'types';

const memoizedTranslateEn = memoize(translateEn);
const memoizedTranslatePl = memoize(translatePl);

const localeTranslate: Record<Locale, (word: string) => Promise<WordDefinition>> = {
  'en-GB': memoizedTranslateEn,
  'en-US': memoizedTranslateEn,
  'pl-PL': memoizedTranslatePl,
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
