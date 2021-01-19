import logger from '@scrabble-solver/logger';
import { WordDefinition } from '@scrabble-solver/types';
import { NextApiRequest, NextApiResponse } from 'next';

import { getServerLoggingData, validateLocale, validateWord, translateEn, translateFr, translatePl } from 'api';
import { Locale } from 'types';

interface RequestData {
  locale: Locale;
  word: string;
}

const localeTranslate: Record<Locale, (word: string) => Promise<WordDefinition>> = {
  'en-GB': translateEn,
  'en-US': translateEn,
  'fr-FR': translateFr,
  'pl-PL': translatePl,
};

const dictionary = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  const meta = getServerLoggingData(request);

  try {
    const { locale, word } = parseRequest(request);
    logger.info('dictionary - request', {
      meta,
      payload: {
        locale,
        word,
      },
    });
    const translate = localeTranslate[locale];
    const result = await translate(word);
    response.status(200).send(result.toJson());
  } catch (error) {
    logger.error('dictionary - error', { error, meta });
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

export default dictionary;
