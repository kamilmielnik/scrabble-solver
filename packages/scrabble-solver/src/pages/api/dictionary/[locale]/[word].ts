import { games } from '@scrabble-solver/configs';
import { COMMA_ARABIC, COMMA_LATIN } from '@scrabble-solver/constants';
import { dictionaries } from '@scrabble-solver/dictionaries';
import { logEvent } from '@scrabble-solver/logger';
import { type Locale, isLocale } from '@scrabble-solver/types';
import { getWordDefinition } from '@scrabble-solver/word-definitions';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { type ApiContext, BadRequestError, withApiLog } from '@/api';

interface RequestData {
  locale: Locale;
  words: string[];
}

const MAXIMUM_COLLISIONS_COUNT = Object.values(games).reduce((result, game) => Math.max(result, game.rackSize), 0);
const MAXIMUM_WORDS_COUNT = MAXIMUM_COLLISIONS_COUNT + 1;

export default withApiLog('definition', dictionary);

async function dictionary(request: NextApiRequest, response: NextApiResponse, { ip, getElapsedMs }: ApiContext) {
  const { locale, words } = parseRequest(request);
  const gaddag = await dictionaries.get(locale);
  const results = await Promise.all(words.map((word) => getWordDefinition(locale, word, gaddag.has(word))));
  response.status(200).send(results.map((result) => result.toJson()));

  logEvent({
    type: 'definition',
    ip,
    ms: getElapsedMs(),
    locale,
    words: words.join(','),
    found: results.filter((result) => result.definitions.length > 0).length,
  });
}

function parseRequest(request: NextApiRequest): RequestData {
  const { locale, word } = request.query;

  if (!isLocale(locale)) {
    throw new BadRequestError('Invalid "locale" parameter');
  }

  if (typeof word !== 'string' || word.length === 0) {
    throw new BadRequestError('Invalid "word" parameter');
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
    throw new BadRequestError('Invalid "word" parameter');
  }

  return {
    locale,
    words,
  };
}
