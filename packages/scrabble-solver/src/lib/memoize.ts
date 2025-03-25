interface AnyFunction<Args extends unknown[], Result> {
  (...parameters: Args): Result;
}

interface Entry<Args extends unknown[], Result> {
  parameters: Args;
  result: Result;
}

export const memoize = <Args extends unknown[], Result>(
  fn: AnyFunction<Args, Result>,
): AnyFunction<Args, Result> & {
  hasCache: (...parameters: Args) => boolean;
} => {
  const cache: Entry<Args, Result>[] = [];

  const hasCache = (...parameters: Args): boolean => Boolean(readCache(parameters));

  const readCache = (parameters: Args): Result | undefined => {
    return cache.find((entry) => parametersEqual(entry.parameters, parameters))?.result;
  };

  const removeCache = (parameters: Args): void => {
    const index = cache.findIndex((entry) => parametersEqual(entry.parameters, parameters));

    if (index >= 0) {
      cache.splice(index, 1);
    }
  };

  const writeCache = (parameters: Args, result: Result): void => {
    cache.push({ parameters, result });
  };

  const memoized = (...parameters: Args): Result => {
    const cached = readCache(parameters);

    if (cached) {
      return cached;
    }

    const result = fn(...parameters);

    if (result instanceof Promise) {
      result.catch(() => {
        removeCache(parameters);
      });
    }

    writeCache(parameters, result);

    return result;
  };

  return Object.assign(memoized, { hasCache });
};

const parametersEqual = <Args extends unknown[]>(a: Args, b: Args): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((parameter: Args[typeof index], index: number) => parameter === b[index]);
};
