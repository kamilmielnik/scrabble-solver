export interface ErrorDescription {
  message: string;
  stack: string | undefined;
}

export function describeError(error: unknown): ErrorDescription {
  return { message: formatError(error), stack: error instanceof Error ? error.stack : undefined };
}

function formatError(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const heading = `${error.name}${formatCode(error)}: ${error.message}`.trimEnd();
  const nested = getNestedErrors(error);
  return nested.length === 0 ? heading : `${heading} (${nested.map(formatError).join('; ')})`;
}

function formatCode(error: Error): string {
  return 'code' in error && typeof error.code === 'string' ? ` [${error.code}]` : '';
}

function getNestedErrors(error: Error): unknown[] {
  if (error instanceof AggregateError) {
    return error.errors;
  }

  return error.cause === undefined ? [] : [error.cause];
}
