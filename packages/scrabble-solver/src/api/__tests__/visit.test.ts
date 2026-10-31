/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Game, Locale } from '@scrabble-solver/types';
import { beforeEach, describe, expect, it, mock } from 'bun:test';

import { noop } from '../../lib/noop';
import type * as apiVisitModule from '../../pages/api/visit';
import type * as testApiModule from '../../test/api';

const logEvent = mock<(event: Record<string, unknown>) => void>();

await mock.module('@scrabble-solver/logger', () => ({ logError: noop, logEvent }));

const { default: handler }: typeof apiVisitModule = await import('../../pages/api/visit');
const { createApiRequest, createApiResponse }: typeof testApiModule = await import('../../test/api');

beforeEach(() => {
  logEvent.mockClear();
});

describe('/api/visit', () => {
  it('answers true and logs a valid ping', async () => {
    const response = await visit({
      game: Game.Scrabble,
      locale: Locale.PL_PL,
      referrer: 'https://example.com',
      url: 'https://scrabble-solver.org/?ref=x',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(true);
    expect(logEvent).toHaveBeenCalledWith({
      game: Game.Scrabble,
      ip: '10.0.0.1',
      locale: Locale.PL_PL,
      referrer: 'https://example.com',
      type: 'visit',
      ua: 'agent',
      url: 'https://scrabble-solver.org/?ref=x',
    });
  });

  it.each([[undefined], ['text'], [null], [1]])('accepts the non-object body %j', async (body) => {
    const response = await visit(body);

    expect(response.statusCode).toBe(200);
    expect(logEvent.mock.calls[0][0]).toMatchObject({
      game: undefined,
      locale: undefined,
      referrer: undefined,
      url: undefined,
    });
  });

  it('ignores unexpected field values instead of rejecting them', async () => {
    const response = await visit({ extra: true, game: 'chess', locale: 'xx', referrer: 1, url: '' });

    expect(response.statusCode).toBe(200);
    expect(logEvent.mock.calls[0][0]).toMatchObject({
      game: undefined,
      locale: undefined,
      referrer: undefined,
      url: undefined,
    });
  });

  it('caps urls at 256 characters', async () => {
    await visit({ referrer: 'r'.repeat(300), url: 'u'.repeat(300) });

    const { referrer, url } = logEvent.mock.calls[0][0] as { referrer: string; url: string };

    expect(referrer).toHaveLength(256);
    expect(url).toHaveLength(256);
  });
});

async function visit(body: unknown) {
  const response = createApiResponse();
  await handler(createApiRequest({ body, headers: { 'user-agent': 'agent' }, method: 'PUT' }), response);
  return response;
}
