/* eslint-disable max-lines */

import { beforeEach, describe, expect, it, mock } from 'bun:test';

import type * as apiModule from '..';
import type * as testApiModule from '../../test/api';

const logEvent = mock<(event: Record<string, unknown>) => void>();
const logError = mock<(operation: string, error: unknown, context: Record<string, unknown>) => void>();

await mock.module('@scrabble-solver/logger', () => ({ logError, logEvent }));

const { BadRequestError, withApiLog }: typeof apiModule = await import('..');
const { createApiRequest, createApiResponse }: typeof testApiModule = await import('../../test/api');

beforeEach(() => {
  logEvent.mockClear();
  logError.mockClear();
});

describe('context', () => {
  it('uses the last x-forwarded-for entry, the one the trusted proxy appended', async () => {
    expect(await readContext({ headers: { 'x-forwarded-for': '1.1.1.1, 2.2.2.2 ' } })).toMatchObject({ ip: '2.2.2.2' });
  });

  it('reads the last entry of a repeated x-forwarded-for header', async () => {
    const headers = { 'x-forwarded-for': ['1.1.1.1', '3.3.3.3, 4.4.4.4'] };

    expect(await readContext({ headers })).toMatchObject({ ip: '4.4.4.4' });
  });

  it('falls back to the socket address', async () => {
    expect(await readContext({ remoteAddress: '5.5.5.5' })).toMatchObject({ ip: '5.5.5.5' });
    expect(await readContext({ headers: { 'x-forwarded-for': '' }, remoteAddress: '5.5.5.5' })).toMatchObject({
      ip: '5.5.5.5',
    });
  });

  it('strips the IPv4-mapped IPv6 prefix', async () => {
    expect(await readContext({ remoteAddress: '::ffff:6.6.6.6' })).toMatchObject({ ip: '6.6.6.6' });
  });

  it('caps the user agent at 512 characters', async () => {
    const { ua } = await readContext({ headers: { 'user-agent': 'x'.repeat(600) } });

    expect(ua).toHaveLength(512);
  });

  it('leaves a missing user agent undefined', async () => {
    expect((await readContext()).ua).toBeUndefined();
  });

  it('reports elapsed time as a whole number', async () => {
    const { getElapsedMs } = await readContext();

    expect(Number.isInteger(getElapsedMs())).toBe(true);
    expect(getElapsedMs()).toBeGreaterThanOrEqual(0);
  });
});

describe('errors', () => {
  it('leaves a successful handler alone', async () => {
    const response = createApiResponse();

    await withApiLog('solve', (_request, res) => {
      res.status(201).send('ok');
    })(createApiRequest(), response);

    expect(response.statusCode).toBe(201);
    expect(response.body).toBe('ok');
    expect(logEvent).not.toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();
  });

  it('answers a BadRequestError with 400 and a stackless warn event', async () => {
    const response = createApiResponse();
    const request = createApiRequest({ body: { a: 1 }, headers: { 'user-agent': 'ua', 'x-forwarded-for': '1.1.1.1' } });

    await withApiLog('solve', () => {
      throw new BadRequestError('Invalid "x"');
    })(request, response);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Bad request', message: 'Invalid "x"' });
    expect(logError).not.toHaveBeenCalled();
    expect(logEvent).toHaveBeenCalledWith({
      input: '{"a":1}',
      ip: '1.1.1.1',
      level: 'warn',
      message: 'Invalid "x"',
      operation: 'solve',
      type: 'error',
      ua: 'ua',
    });
  });

  it('answers any other error with 500 and logs it as an error', async () => {
    const response = createApiResponse();
    const error = new Error('boom');

    await withApiLog('verify', () => {
      throw error;
    })(createApiRequest({ body: { a: 1 } }), response);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Server error', message: 'boom' });
    expect(logEvent).not.toHaveBeenCalled();
    expect(logError).toHaveBeenCalledWith('verify', error, { input: '{"a":1}', ip: '10.0.0.1', ua: undefined });
  });

  it('handles a rejected async handler', async () => {
    const response = createApiResponse();

    await withApiLog('verify', async () => {
      await Promise.reject(new Error('later'));
    })(createApiRequest(), response);

    expect(response.statusCode).toBe(500);
  });

  it('hides the value of a thrown non-error', async () => {
    const response = createApiResponse();

    await withApiLog('verify', () => {
      // oxlint-disable-next-line no-throw-literal
      throw 'text';
    })(createApiRequest(), response);

    expect(response.body).toEqual({ error: 'Server error', message: 'Unknown error' });
  });

  it('logs but does not answer twice after the handler already responded', async () => {
    const response = createApiResponse();

    await withApiLog('verify', (_request, res) => {
      res.status(200).send('done');
      throw new Error('after send');
    })(createApiRequest(), response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('done');
    expect(logError).toHaveBeenCalledTimes(1);
  });

  it('does not answer twice for a bad request after the handler responded', async () => {
    const response = createApiResponse();

    await withApiLog('verify', (_request, res) => {
      res.status(200).send('done');
      throw new BadRequestError('late');
    })(createApiRequest(), response);

    expect(response.body).toBe('done');
  });
});

describe('input excerpt', () => {
  it('uses the query of a GET and the body of anything else', async () => {
    expect(await readInput({ body: { ignored: true }, method: 'GET', query: { a: '1' } })).toBe('{"a":"1"}');
    expect(await readInput({ body: { a: 1 }, method: 'PUT', query: { ignored: '1' } })).toBe('{"a":1}');
  });

  it('puts small fields first so a huge field cannot push them out of the excerpt', async () => {
    const input = await readInput({ body: { board: 'x'.repeat(2000), locale: 'en-US' } });

    expect(input.startsWith('{"locale":"en-US","board":"xxx')).toBe(true);
  });

  it('caps the excerpt at 1024 characters', async () => {
    expect(await readInput({ body: { board: 'x'.repeat(2000) } })).toHaveLength(1024);
  });

  it('keeps arrays in their order', async () => {
    expect(await readInput({ body: [{ a: 'long value' }, 1] })).toBe('[{"a":"long value"},1]');
  });

  it('handles a null field', async () => {
    expect(await readInput({ body: { a: null, b: undefined, c: 1 } })).toBe('{"c":1,"a":null}');
  });

  it('writes null for a missing body', async () => {
    expect(await readInput({ body: undefined })).toBe('null');
  });

  it('writes scalars as they are', async () => {
    expect(await readInput({ body: 'text' })).toBe('"text"');
  });

  it('survives a circular body', async () => {
    const body: Record<string, unknown> = {};
    body.self = body;

    expect(await readInput({ body })).toStartWith('(unserializable: ');
  });

  it('survives a body that does not serialize', async () => {
    expect(await readInput({ body: { value: 1n } })).toStartWith('(unserializable: ');
  });
});

async function readContext(options: Parameters<typeof createApiRequest>[0] = {}) {
  let context: Parameters<Parameters<typeof withApiLog>[1]>[2] | undefined;

  await withApiLog('visit', (_request, _response, handlerContext) => {
    context = handlerContext;
  })(createApiRequest(options), createApiResponse());

  return context!;
}

async function readInput(options: Parameters<typeof createApiRequest>[0]): Promise<string> {
  await withApiLog('solve', () => {
    throw new BadRequestError('x');
  })(createApiRequest(options), createApiResponse());

  return logEvent.mock.calls[logEvent.mock.calls.length - 1][0].input as string;
}
