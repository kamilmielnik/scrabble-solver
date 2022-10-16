interface AnyFunction {
  (...parameters: any[]): any | Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface AnyCachedFunction<T extends AnyFunction> extends AnyFunction {
  hasCache: (...parameters: Parameters<T>) => boolean;
}

interface Entry<T extends AnyFunction> {
  parameters: Parameters<T>;
  result: ReturnType<T>;
}

const memoize = <T extends AnyFunction>(fn: T): AnyCachedFunction<T> => {
  const cache: Entry<T>[] = [];

  const hasCache = (...parameters: Parameters<T>): boolean => Boolean(readCache(parameters));

  const readCache = (parameters: Parameters<T>): ReturnType<T> | undefined => {
    return cache.find((entry) => parametersEqual(entry.parameters, parameters))?.result;
  };

  const removeCache = (parameters: Parameters<T>): void => {
    const index = cache.findIndex((entry) => parametersEqual(entry.parameters, parameters));

    if (index >= 0) {
      cache.splice(index, 1);
    }
  };

  const writeCache = (parameters: Parameters<T>, result: ReturnType<T>): void => {
    cache.push({ parameters, result });
  };

  const memoized = (...parameters: Parameters<T>): ReturnType<T> => {
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

const parametersEqual = <T extends AnyFunction>(a: Parameters<T>, b: Parameters<T>): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((parameter: Parameters<T>[typeof index], index: number) => parameter === b[index]);
};

export default memoize;
