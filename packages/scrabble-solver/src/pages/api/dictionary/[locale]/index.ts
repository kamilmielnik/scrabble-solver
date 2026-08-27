import { type Gaddag } from '@kamilmielnik/gaddag';
import { dictionaries } from '@scrabble-solver/dictionaries';
import { logEvent } from '@scrabble-solver/logger';
import { isLocale, type Locale } from '@scrabble-solver/types';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { promisify } from 'util';
import { gzip } from 'zlib';

import { type ApiContext, BadRequestError, withApiLog } from '@/api';

interface RequestData {
  locale: Locale;
}

export default withApiLog('download', dictionary);

async function dictionary(request: NextApiRequest, response: NextApiResponse, { ip, getElapsedMs }: ApiContext) {
  const { locale } = parseRequest(request);
  const gaddag = await dictionaries.get(locale);
  const encoding = acceptsGzip(request) ? 'gzip' : 'identity';
  const body = encoding === 'gzip' ? await getCompressedDictionary(gaddag) : getSerializedDictionary(gaddag);

  // no-cache makes clients store the payload but revalidate it, so unchanged
  // re-downloads become 304s, answered by Next's built-in ETag handling.
  response.setHeader('Cache-Control', 'no-cache');
  response.setHeader('Content-Type', 'application/octet-stream');
  response.setHeader('Vary', 'Accept-Encoding');

  if (encoding === 'gzip') {
    response.setHeader('Content-Encoding', 'gzip');
  }

  response.status(200).send(body);

  logEvent({
    type: 'download',
    ip,
    ms: getElapsedMs(),
    locale,
    status: response.statusCode,
    encoding,
    bytes: response.statusCode === 304 ? 0 : body.byteLength,
  });
}

function parseRequest(request: NextApiRequest): RequestData {
  const { locale } = request.query;

  if (!isLocale(locale)) {
    throw new BadRequestError('Invalid "locale" parameter');
  }

  return {
    locale,
  };
}

function acceptsGzip(request: NextApiRequest): boolean {
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
}

// Dictionaries rebuild at most daily, so each response variant is produced
// once and lives exactly as long as the in-memory dictionary it was made from.
const serializedCache = new WeakMap<Gaddag, Buffer>();
const compressedCache = new WeakMap<Gaddag, Promise<Buffer>>();

function getSerializedDictionary(gaddag: Gaddag): Buffer {
  let serialized = serializedCache.get(gaddag);

  if (!serialized) {
    // serialize() returns freshly allocated bytes, so the Buffer wraps them without copying.
    const bytes = gaddag.serialize();
    serialized = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    serializedCache.set(gaddag, serialized);
  }

  return serialized;
}

const gzipAsync = promisify(gzip);

function getCompressedDictionary(gaddag: Gaddag): Promise<Buffer> {
  let compressed = compressedCache.get(gaddag);

  if (!compressed) {
    compressed = gzipAsync(gaddag.serialize());
    compressedCache.set(gaddag, compressed);
    compressed.catch(() => compressedCache.delete(gaddag));
  }

  return compressed;
}

export const config = {
  api: {
    responseLimit: '50mb',
  },
};
