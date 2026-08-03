import { type Gaddag } from '@kamilmielnik/gaddag';
import { dictionaries } from '@scrabble-solver/dictionaries';
import { logger } from '@scrabble-solver/logger';
import { isLocale, type Locale } from '@scrabble-solver/types';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { promisify } from 'util';
import { gzip } from 'zlib';

import { getServerLoggingData } from '@/api';

interface RequestData {
  locale: Locale;
}

const gzipAsync = promisify(gzip);

// Dictionaries rebuild at most daily, so each one is compressed once and the
// result lives exactly as long as the in-memory dictionary it was made from.
const compressedCache = new WeakMap<Gaddag, Promise<Buffer>>();

const getCompressedDictionary = (gaddag: Gaddag): Promise<Buffer> => {
  let compressed = compressedCache.get(gaddag);

  if (!compressed) {
    compressed = gzipAsync(gaddag.serialize());
    compressedCache.set(gaddag, compressed);
  }

  return compressed;
};

const acceptsGzip = (request: NextApiRequest): boolean => {
  const acceptEncoding = request.headers['accept-encoding'];
  const header = Array.isArray(acceptEncoding) ? acceptEncoding.join(',') : acceptEncoding;
  return typeof header === 'string' && /\bgzip\b/.test(header);
};

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
    response.setHeader('Vary', 'Accept-Encoding');

    if (acceptsGzip(request)) {
      response.setHeader('Content-Encoding', 'gzip');
      response.status(200).send(await getCompressedDictionary(gaddag));
    } else {
      response.status(200).send(Buffer.from(gaddag.serialize()));
    }
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
