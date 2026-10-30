import { type NextApiRequest, type NextApiResponse } from 'next';

interface RequestOptions {
  body?: unknown;
  headers?: NextApiRequest['headers'];
  method?: string;
  query?: NextApiRequest['query'];
  remoteAddress?: string;
}

export interface FakeResponse {
  body: unknown;
  headers: Record<string, unknown>;
  headersSent: boolean;
  send: (body: unknown) => void;
  setHeader: (name: string, value: unknown) => FakeResponse;
  status: (code: number) => FakeResponse;
  statusCode: number;
}

export function createApiRequest({
  body,
  headers = {},
  method = 'POST',
  query = {},
  remoteAddress = '10.0.0.1',
}: RequestOptions = {}): NextApiRequest {
  return { body, headers, method, query, socket: { remoteAddress } } as unknown as NextApiRequest;
}

export function createApiResponse(): FakeResponse & NextApiResponse {
  const response: FakeResponse = {
    body: undefined,
    headers: {},
    headersSent: false,
    send(body) {
      response.body = body;
      response.headersSent = true;
    },
    setHeader(name, value) {
      response.headers[name] = value;
      return response;
    },
    status(code) {
      response.statusCode = code;
      return response;
    },
    statusCode: 200,
  };

  return response as FakeResponse & NextApiResponse;
}
