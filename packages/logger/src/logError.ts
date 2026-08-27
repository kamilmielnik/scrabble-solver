import { IS_TEST_RUN } from './constants';
import { describeError, type ErrorDescription } from './describeError';
import { type EventOf, type Operation } from './events';
import { logEvent } from './logEvent';

type ErrorContext = Partial<Pick<EventOf<'error'>, 'level' | 'input' | 'ip' | 'locale' | 'ua'>>;

export function logError(
  operation: Operation,
  error: unknown,
  { level = 'error', ...context }: ErrorContext = {},
): void {
  const description = describeError(error);
  logEvent({ type: 'error', level, operation, ...description, ...context });

  if (level === 'error' && !IS_TEST_RUN) {
    process.stderr.write(formatStderrEntry(operation, description));
  }
}

function formatStderrEntry(operation: Operation, { message, stack }: ErrorDescription): string {
  const frames = stack?.split('\n').filter((line) => line.startsWith('    at ')) ?? [];
  return `${[`${operation}: ${message}`, ...frames].join('\n')}\n`;
}
