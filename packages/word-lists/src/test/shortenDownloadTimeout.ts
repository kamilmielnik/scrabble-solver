import { spyOn } from 'bun:test';

const SHORT_TIMEOUT_MS = 50;

export function shortenDownloadTimeout(): void {
  const { timeout } = AbortSignal;

  spyOn(AbortSignal, 'timeout').mockImplementation(() => timeout.call(AbortSignal, SHORT_TIMEOUT_MS));
}
