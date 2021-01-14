import logger from '@scrabble-solver/logger';
import { WordDefinition } from '@scrabble-solver/models';
import { NextApiRequest, NextApiResponse } from 'next';

import { validateLocale, validateWord, translateEn, translatePl } from 'api';
import { Locale } from 'types';

interface RequestData {
  locale: Locale;
  word: string;
}

const localeTranslate: Record<Locale, (word: string) => Promise<WordDefinition>> = {
  'en-GB': translateEn,
  'en-US': translateEn,
  'pl-PL': translatePl,
};

const dictionary = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  try {
    const requestData = parseRequest(request);
    logRequest(requestData);
    const { locale, word } = requestData;
    const translate = localeTranslate[locale];
    const result = await translate(word);
    response.status(200).send(result.toJson());
  } catch (error) {
    logger.error(error);
    response.status(500).send({
      error: 'Server error',
      message: error.message,
    });
  }
};

const parseRequest = (request: NextApiRequest): RequestData => {
  const { locale, word } = request.query;

  validateLocale(locale);
  validateWord(word);

  return {
    locale: locale as Locale,
    word: word as string,
  };
};

const logRequest = (requestData: RequestData) => {
  const { locale, word } = requestData;

  logger.info('dictionary - request data', {
    locale,
    word,
  });
};

export default dictionary;
