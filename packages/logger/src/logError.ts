import { IS_TEST_RUN } from './constants';
import { type Operation } from './events';
import { logEvent } from './logEvent';

interface ErrorContext {
  input?: string;
  ip?: string;
  locale?: string;
  ua?: string;
}

export function logError(operation: Operation, error: unknown, context: ErrorContext = {}): void {
  const { message, stack } = describeError(error);
  logEvent({ type: 'error', level: 'error', operation, message, stack, ...context });

  if (!IS_TEST_RUN) {
    process.stderr.write(`${operation}: ${stack ?? message}\n`);
  }
}

function describeError(error: unknown): { message: string; stack: string | undefined } {
  if (error instanceof Error) {
    return { message: `${error.name}: ${error.message}`, stack: error.stack };
  }

  return { message: String(error), stack: undefined };
}
