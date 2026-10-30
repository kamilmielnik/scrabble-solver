import { serve } from 'bun';
import { afterAll, afterEach, beforeEach, mock, spyOn } from 'bun:test';
import { http, https } from 'follow-redirects';

import { installTempFileSandbox } from './installTempFileSandbox';

export interface FetcherHarness {
  getCollationLocales: () => string[];
  listTempFiles: () => string[];
  refuseConnections: (url: string) => void;
  requestedUrls: string[];
  serve: (url: string, body: Buffer | string, status?: number) => void;
  waitForWriteStreams: () => Promise<void>;
}

interface RemoteFile {
  body: Buffer | string;
  status: number;
}

const NOTHING_LISTENS_HERE = 'http://127.0.0.1:1/';

/**
 * Language fetchers hard-code https URLs. This answers those URLs from a local server, so a fetcher runs for real down
 * to the socket without leaving the machine. Call it before importing the fetcher.
 */
export function installFetcherHarness(): FetcherHarness {
  const { listFiles, waitForWriteStreams } = installTempFileSandbox();
  const collationLocales = new Set<string>();
  const refusedUrls = new Set<string>();
  const remoteFiles = new Map<string, RemoteFile>();
  const requestedUrls: string[] = [];
  const server = serve({ fetch: respond, port: 0 });

  beforeEach(reset);
  afterEach(() => {
    mock.restore();
  });
  afterAll(() => server.stop(true));

  return {
    getCollationLocales: () => [...collationLocales],
    listTempFiles: listFiles,
    refuseConnections: (url) => refusedUrls.add(url),
    requestedUrls,
    serve: (url, body, status = 200) => remoteFiles.set(url, { body, status }),
    waitForWriteStreams,
  };

  function respond(request: Request): Response {
    const remoteUrl = decodeURIComponent(new URL(request.url).pathname.slice(1));
    const file = remoteFiles.get(remoteUrl);
    return file
      ? new Response(file.body as BodyInit, { status: file.status })
      : new Response('Not Found', { status: 404 });
  }

  function reset(): void {
    collationLocales.clear();
    refusedUrls.clear();
    remoteFiles.clear();
    requestedUrls.length = 0;
    spyOn(https, 'get').mockImplementation(forwardToLocalServer as unknown as typeof https.get);
    spyOn(String.prototype, 'localeCompare').mockImplementation(recordLocaleAndCompare);
  }

  function forwardToLocalServer(url: string, callback: Parameters<typeof http.get>[1]) {
    requestedUrls.push(url);
    const target = refusedUrls.has(url) ? NOTHING_LISTENS_HERE : `${server.url.origin}/${encodeURIComponent(url)}`;
    return http.get(target, callback);
  }

  function recordLocaleAndCompare(this: string, that: string, locales?: Intl.LocalesArgument): number {
    if (typeof locales === 'string') {
      collationLocales.add(locales);
    }

    return new Intl.Collator(locales).compare(this, that);
  }
}
