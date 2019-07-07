import { NullWordDefinition } from '@scrabble-solver/models';

import translateEn from './en';
import translatePl from './pl';
import { validateLocale, validateWord } from './validate';

const localeTranslate = {
  'en-GB': translateEn,
  'en-US': translateEn,
  'pl-PL': translatePl
};

export default async (request, response) => {
  try {
    const { locale, word } = parseRequest(request);
    const translate = localeTranslate[locale];
    const result = await translate(word);
    response.send(result.toJson());
  } catch (error) {
    response.send(NullWordDefinition);
  }
};

const parseRequest = (request) => {
  const { locale, word } = request.query;
  validateLocale(locale);
  validateWord(word);

  return {
    locale,
    word
  };
};
