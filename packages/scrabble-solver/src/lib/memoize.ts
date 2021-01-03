interface AnyFunction {
  (...parameters: any): any;
}

interface AnyCachedFunction<T extends AnyFunction> extends AnyFunction {
  hasCache: (...parameters: Parameters<T>) => boolean;
}

interface Entry<T extends AnyFunction> {
  parameters: Parameters<T>;
  result: ReturnType<T>;
}

const parametersEqual = <T extends AnyFunction>(a: Parameters<T>, b: Parameters<T>): boolean => {
  return a.length === b.length && a.every((parameter: any, index: number) => parameter === b[index]);
};

const memoize = <T extends (...parameters: any) => any>(fn: T): AnyCachedFunction<T> => {
  const cache: Entry<T>[] = [];

  const hasCache = (...parameters: Parameters<T>): boolean => Boolean(readCache(parameters));

  const readCache = (parameters: Parameters<T>): ReturnType<T> | undefined => {
    return cache.find((entry) => parametersEqual(entry.parameters, parameters))?.result;
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

    writeCache(parameters, result);

    return result;
  };

  return Object.assign(memoized, { hasCache });
};

export default memoize;
