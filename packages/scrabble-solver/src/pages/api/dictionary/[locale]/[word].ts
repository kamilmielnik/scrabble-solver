import { scrabble } from '@scrabble-solver/configs';
import logger from '@scrabble-solver/logger';
import { isLocale, Locale } from '@scrabble-solver/types';
import { getWordDefinition } from '@scrabble-solver/word-definitions';
import { NextApiRequest, NextApiResponse } from 'next';

import { getServerLoggingData } from 'api';

interface RequestData {
  locale: Locale;
  words: string[];
}

const MAXIMUM_WORDS_COUNT = scrabble['en-US'].maximumCharactersCount;

const dictionary = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  const meta = getServerLoggingData(request);

  try {
    const { locale, words } = parseRequest(request);

    logger.info('dictionary - request', {
      meta,
      payload: {
        locale,
        words,
      },
    });

    const results = await Promise.all(words.map((word) => getWordDefinition(locale, word)));
    response.status(200).send(results.map((result) => result.toJson()));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('dictionary - error', { error, meta });
    response.status(500).send({ error: 'Server error', message });
  }
};

const parseRequest = (request: NextApiRequest): RequestData => {
  const { locale, word } = request.query;

  if (!isLocale(locale)) {
    throw new Error('Invalid "locale" parameter');
  }

  if (typeof word !== 'string' || word.length === 0) {
    throw new Error('Invalid "word" parameter');
  }

  const words = word.split(',').map((part) => part.trim());

  if (words.length > MAXIMUM_WORDS_COUNT) {
    throw new Error('Invalid "word" parameter');
  }

  return {
    locale,
    words,
  };
};

export default dictionary;
