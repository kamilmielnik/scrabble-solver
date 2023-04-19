import { games } from '@scrabble-solver/configs';
import { COMMA_ARABIC, COMMA_LATIN } from '@scrabble-solver/constants';
import { dictionaries } from '@scrabble-solver/dictionaries';
import logger from '@scrabble-solver/logger';
import { Locale, isLocale } from '@scrabble-solver/types';
import { getWordDefinition } from '@scrabble-solver/word-definitions';
import { NextApiRequest, NextApiResponse } from 'next';

import { getServerLoggingData } from 'api';

interface RequestData {
  locale: Locale;
  words: string[];
}

const MAXIMUM_COLLISIONS_COUNT = Object.values(games).reduce(
  (result, game) => Math.max(result, game.maximumCharactersCount),
  0,
);
const MAXIMUM_WORDS_COUNT = MAXIMUM_COLLISIONS_COUNT + 1;

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

    const trie = await dictionaries.get(locale);
    const results = await Promise.all(words.map((word) => getWordDefinition(locale, word, trie.has(word))));
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

  const words = Array.from(
    new Set(
      word
        .replaceAll(COMMA_ARABIC, COMMA_LATIN)
        .split(COMMA_LATIN)
        .map((part) => part.trim())
        .filter(Boolean),
    ),
  );

  if (words.length > MAXIMUM_WORDS_COUNT) {
    throw new Error('Invalid "word" parameter');
  }

  return {
    locale,
    words,
  };
};

export default dictionary;
