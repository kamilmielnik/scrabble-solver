import { serve } from 'bun';
import { afterAll, afterEach, beforeEach, mock, spyOn } from 'bun:test';
import { http, https } from 'follow-redirects';
import { type RequestOptions } from 'http';

import { installTempFileSandbox } from './installTempFileSandbox';

export interface FetcherHarness {
  getLowerCasingLocales: () => string[];
  listTempFiles: () => string[];
  refuseConnections: (url: string) => void;
  requestedUrls: string[];
  serve: (url: string, body: Buffer | string, status?: number) => void;
}

interface RemoteFile {
  body: Buffer | string;
  status: number;
}

const NOTHING_LISTENS_HERE = 'http://127.0.0.1:1/';
// oxlint-disable-next-line typescript/unbound-method
const { toLocaleLowerCase } = String.prototype;

/**
 * Language fetchers hard-code https URLs. This answers those URLs from a local server, so a fetcher runs for real down
 * to the socket without leaving the machine. Call it before importing the fetcher.
 */
export function installFetcherHarness(): FetcherHarness {
  const { listFiles } = installTempFileSandbox();
  const lowerCasingLocales = new Set<string>();
  const refusedUrls = new Set<string>();
  const remoteFiles = new Map<string, RemoteFile>();
  const requestedUrls: string[] = [];
  const server = serve({ fetch: respond, port: 0 });

  beforeEach(reset);
  afterEach(() => {
    mock.restore();
    Object.assign(String.prototype, { toLocaleLowerCase });
  });
  afterAll(() => server.stop(true));

  return {
    getLowerCasingLocales: () => [...lowerCasingLocales],
    listTempFiles: listFiles,
    refuseConnections: (url) => refusedUrls.add(url),
    requestedUrls,
    serve: (url, body, status = 200) => remoteFiles.set(url, { body, status }),
  };

  function respond(request: Request): Response {
    const remoteUrl = decodeURIComponent(new URL(request.url).pathname.slice(1));
    const file = remoteFiles.get(remoteUrl);
    return file
      ? new Response(file.body as BodyInit, { status: file.status })
      : new Response('Not Found', { status: 404 });
  }

  function reset(): void {
    lowerCasingLocales.clear();
    refusedUrls.clear();
    remoteFiles.clear();
    requestedUrls.length = 0;
    spyOn(https, 'get').mockImplementation(forwardToLocalServer as unknown as typeof https.get);
    Object.assign(String.prototype, { toLocaleLowerCase: recordLocaleAndLowerCase });
  }

  function forwardToLocalServer(url: string, options: RequestOptions, callback: () => void) {
    requestedUrls.push(url);
    const target = refusedUrls.has(url) ? NOTHING_LISTENS_HERE : `${server.url.origin}/${encodeURIComponent(url)}`;
    return http.get(target, options, callback);
  }

  function recordLocaleAndLowerCase(this: string, locales?: Intl.LocalesArgument): string {
    if (typeof locales === 'string') {
      lowerCasingLocales.add(locales);
    }

    return toLocaleLowerCase.call(this, locales);
  }
}
