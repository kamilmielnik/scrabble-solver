import { dictionaries } from '@scrabble-solver/dictionaries';
import { logger } from '@scrabble-solver/logger';
import { isLocale, type Locale } from '@scrabble-solver/types';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { getServerLoggingData } from '@/api';

interface RequestData {
  locale: Locale;
}

const dictionary = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  const meta = getServerLoggingData(request);

  try {
    const { locale } = parseRequest(request);

    logger.info('dictionary - request', {
      meta,
      payload: {
        locale,
      },
    });

    const gaddag = await dictionaries.get(locale);
    response.setHeader('Content-Type', 'application/octet-stream');
    response.status(200).send(Buffer.from(gaddag.serialize()));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('dictionary - error', { error, meta });
    response.status(500).send({ error: 'Server error', message });
  }
};

const parseRequest = (request: NextApiRequest): RequestData => {
  const { locale } = request.query;

  if (!isLocale(locale)) {
    throw new Error('Invalid "locale" parameter');
  }

  return {
    locale,
  };
};

export const config = {
  api: {
    responseLimit: '50mb',
  },
};

export default dictionary;
