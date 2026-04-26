import { fetch } from './fetch';

export const fetchJson = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(input, { ...init, headers });
  return response.json();
};
