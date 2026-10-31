import { type Gaddag } from '@kamilmielnik/gaddag';
import { games } from '@scrabble-solver/configs';
import { COMMA_ARABIC, COMMA_LATIN } from '@scrabble-solver/constants';
import { dictionaries } from '@scrabble-solver/dictionaries';
import { logError, logEvent } from '@scrabble-solver/logger';
import { type Locale, isLocale, WordDefinition } from '@scrabble-solver/types';
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

async function dictionary(request: NextApiRequest, response: NextApiResponse, context: ApiContext) {
  const { ip, getElapsedMs } = context;
  const { locale, words } = parseRequest(request);
  const gaddag = await dictionaries.get(locale);
  const results = await findDefinitions(locale, words, gaddag, context);
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

async function findDefinitions(
  locale: Locale,
  words: string[],
  gaddag: Gaddag,
  { ip, ua }: ApiContext,
): Promise<WordDefinition[]> {
  const lookups = await Promise.allSettled(words.map((word) => getWordDefinition(locale, word, gaddag.has(word))));
  const failures = lookups.filter(isRejected);

  if (failures.length > 0 && failures.length === lookups.length) {
    throw failures[0].reason;
  }

  return lookups.map((lookup, index) => {
    if (lookup.status === 'fulfilled') {
      return lookup.value;
    }

    const word = words[index];
    logError('definition', lookup.reason, { level: 'warn', ip, ua, locale, input: word });
    return new WordDefinition({ definitions: [], exists: false, isAllowed: gaddag.has(word), word });
  });
}

function isRejected(lookup: PromiseSettledResult<unknown>): lookup is PromiseRejectedResult {
  return lookup.status === 'rejected';
}
