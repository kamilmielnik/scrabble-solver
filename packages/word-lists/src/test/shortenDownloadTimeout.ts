import { spyOn } from 'bun:test';

const SHORT_TIMEOUT_MS = 50;

export function shortenDownloadTimeout(): void {
  const timeout = AbortSignal.timeout.bind(AbortSignal);

  spyOn(AbortSignal, 'timeout').mockImplementation(() => timeout(SHORT_TIMEOUT_MS));
}
