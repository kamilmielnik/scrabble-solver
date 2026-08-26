import { IS_TEST_RUN } from './constants';
import { describeError, type ErrorDescription } from './describeError';
import { type Operation } from './events';
import { logEvent } from './logEvent';

interface ErrorContext {
  input?: string;
  ip?: string;
  locale?: string;
  ua?: string;
}

export function logError(operation: Operation, error: unknown, context: ErrorContext = {}): void {
  const description = describeError(error);
  logEvent({ type: 'error', level: 'error', operation, ...description, ...context });

  if (!IS_TEST_RUN) {
    process.stderr.write(formatStderrEntry(operation, description));
  }
}

function formatStderrEntry(operation: Operation, { message, stack }: ErrorDescription): string {
  const frames = stack?.split('\n').filter((line) => line.startsWith('    at ')) ?? [];
  return `${[`${operation}: ${message}`, ...frames].join('\n')}\n`;
}
