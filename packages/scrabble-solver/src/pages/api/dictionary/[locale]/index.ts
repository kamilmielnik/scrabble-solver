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
    const isGzip = acceptsGzip(request);
    const body = isGzip ? await getCompressedDictionary(gaddag) : getSerializedDictionary(gaddag);

    // no-cache makes clients store the payload but revalidate it, so unchanged
    // re-downloads become 304s, answered by Next's built-in ETag handling.
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Content-Type', 'application/octet-stream');
    response.setHeader('Vary', 'Accept-Encoding');

    if (isGzip) {
      response.setHeader('Content-Encoding', 'gzip');
    }

    response.status(200).send(body);
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

const acceptsGzip = (request: NextApiRequest): boolean => {
  const acceptEncoding = request.headers['accept-encoding'];
  const header = Array.isArray(acceptEncoding) ? acceptEncoding.join(',') : acceptEncoding;

  if (typeof header !== 'string') {
    return false;
  }

  let wildcardAccepts = false;

  for (const entry of header.split(',')) {
    const [encoding, ...parameters] = entry.split(';').map((token) => token.trim().toLowerCase());
    const isRefused = parameters.some((parameter) => {
      const [name, quality] = parameter.split('=').map((token) => token.trim());
      return name === 'q' && parseFloat(quality) === 0;
    });

    if (encoding === 'gzip' || encoding === 'x-gzip') {
      return !isRefused;
    }

    if (encoding === '*') {
      wildcardAccepts = !isRefused;
    }
  }

  return wildcardAccepts;
};

// serialize() returns freshly allocated bytes, so the Buffer wraps them without copying.
const getSerializedDictionary = (gaddag: Gaddag): Buffer => {
  const bytes = gaddag.serialize();
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
};

const gzipAsync = promisify(gzip);

// Dictionaries rebuild at most daily, so each one is compressed once and the
// result lives exactly as long as the in-memory dictionary it was made from.
const compressedCache = new WeakMap<Gaddag, Promise<Buffer>>();

const getCompressedDictionary = (gaddag: Gaddag): Promise<Buffer> => {
  let compressed = compressedCache.get(gaddag);

  if (!compressed) {
    compressed = gzipAsync(gaddag.serialize());
    compressedCache.set(gaddag, compressed);
    compressed.catch(() => compressedCache.delete(gaddag));
  }

  return compressed;
};

export const config = {
  api: {
    responseLimit: '50mb',
  },
};

export default dictionary;
