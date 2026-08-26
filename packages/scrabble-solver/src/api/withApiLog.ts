import { type Operation, logError, logEvent } from '@scrabble-solver/logger';
import { isObject } from '@scrabble-solver/types';
import { type NextApiHandler, type NextApiRequest, type NextApiResponse } from 'next';

import { BadRequestError } from './BadRequestError';

export interface ApiContext {
  ip: string | undefined;
  getElapsedMs: () => number;
}

type ApiHandler = (request: NextApiRequest, response: NextApiResponse, context: ApiContext) => Promise<void> | void;

interface ErrorResponse {
  error: string;
  message: string;
}

const INPUT_EXCERPT_LENGTH = 1024;

export function withApiLog(operation: Operation, handler: ApiHandler): NextApiHandler {
  return async (request, response) => {
    const startedAt = performance.now();
    const context: ApiContext = {
      ip: getClientIp(request),
      getElapsedMs: () => Math.round(performance.now() - startedAt),
    };

    try {
      await handler(request, response, context);
    } catch (error) {
      const ua = request.headers['user-agent'];
      const input = getInputExcerpt(request);

      if (error instanceof BadRequestError) {
        logEvent({ type: 'error', level: 'warn', operation, ip: context.ip, ua, message: error.message, input });
        respond(response, 400, { error: 'Bad request', message: error.message });
      } else {
        logError(operation, error, { ip: context.ip, ua, input });
        respond(response, 500, {
          error: 'Server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  };
}

function respond(response: NextApiResponse, status: number, body: ErrorResponse): void {
  if (!response.headersSent) {
    response.status(status).send(body);
  }
}

function getClientIp(request: NextApiRequest): string | undefined {
  const forwardedFor = request.headers['x-forwarded-for'];
  const header = Array.isArray(forwardedFor) ? forwardedFor.at(-1) : forwardedFor;
  const ip = header?.split(',').at(-1)?.trim() || request.socket.remoteAddress;
  return ip?.replace(/^::ffff:/, '');
}

function getInputExcerpt(request: NextApiRequest): string {
  const input: unknown = request.method === 'GET' ? request.query : request.body;

  try {
    return JSON.stringify(sortFieldsBySize(input) ?? null).slice(0, INPUT_EXCERPT_LENGTH);
  } catch (error) {
    return `(unserializable: ${String(error)})`;
  }
}

function sortFieldsBySize(input: unknown): unknown {
  if (!isObject(input) || Array.isArray(input)) {
    return input;
  }

  return Object.fromEntries(Object.entries(input).sort(([, a], [, b]) => getJsonSize(a) - getJsonSize(b)));
}

function getJsonSize(value: unknown): number {
  return JSON.stringify(value ?? null).length;
}
