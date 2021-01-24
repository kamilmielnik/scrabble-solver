import logger from '@scrabble-solver/logger';
import { Locale } from '@scrabble-solver/types';
import { getWordDefinition } from '@scrabble-solver/word-definitions';
import { NextApiRequest, NextApiResponse } from 'next';

import { getServerLoggingData, validateLocale, validateWord } from 'api';

interface RequestData {
  locale: Locale;
  word: string;
}

const localeMap: Record<Locale, Parameters<typeof getWordDefinition>[0]> = {
  [Locale.EN_GB]: 'en',
  [Locale.EN_US]: 'en',
  [Locale.FR_FR]: 'fr',
  [Locale.PL_PL]: 'pl',
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
    const result = await getWordDefinition(localeMap[locale], word);
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
