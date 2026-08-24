import { logEvent } from './logEvent';

interface ErrorContext {
  locale?: string;
  ip?: string;
  ua?: string;
  input?: string;
}

export function logError(operation: string, error: unknown, context: ErrorContext = {}): void {
  const { message, stack } = describeError(error);
  logEvent({ type: 'error', level: 'error', operation, message, stack, ...context });
  process.stderr.write(`${operation}: ${stack ?? message}\n`);
}

function describeError(error: unknown): { message: string; stack: string | undefined } {
  if (error instanceof Error) {
    return { message: `${error.name}: ${error.message}`, stack: error.stack };
  }

  return { message: String(error), stack: undefined };
}
