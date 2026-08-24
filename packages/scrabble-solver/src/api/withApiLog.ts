import { logError } from '@scrabble-solver/logger';
import { type NextApiHandler, type NextApiRequest, type NextApiResponse } from 'next';

export interface ApiContext {
  ip: string | undefined;
  getElapsedMs: () => number;
}

type ApiHandler = (request: NextApiRequest, response: NextApiResponse, context: ApiContext) => Promise<void> | void;

const INPUT_EXCERPT_LENGTH = 1024;

export function withApiLog(operation: string, handler: ApiHandler): NextApiHandler {
  return async (request, response) => {
    const startedAt = performance.now();
    const context: ApiContext = {
      ip: getClientIp(request),
      getElapsedMs: () => Math.round(performance.now() - startedAt),
    };

    try {
      await handler(request, response, context);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      response.status(500).send({ error: 'Server error', message });
      logError(operation, error, {
        ip: context.ip,
        ua: request.headers['user-agent'],
        input: getInputExcerpt(request),
      });
    }
  };
}

function getClientIp(request: NextApiRequest): string | undefined {
  const forwardedFor = request.headers['x-forwarded-for'];
  const header = Array.isArray(forwardedFor) ? forwardedFor.at(-1) : forwardedFor;
  const ip = header?.split(',').at(-1)?.trim() || request.socket.remoteAddress;
  return ip?.replace(/^::ffff:/, '');
}

function getInputExcerpt(request: NextApiRequest): string {
  const input: unknown = request.method === 'GET' ? request.query : request.body;
  return JSON.stringify(input ?? null).slice(0, INPUT_EXCERPT_LENGTH);
}
