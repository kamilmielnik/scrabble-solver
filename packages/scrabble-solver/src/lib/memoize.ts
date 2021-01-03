interface Entry<T extends (...parameters: any) => any> {
  parameters: Parameters<T>;
  result: ReturnType<T>;
}

const parametersEqual = <T extends (...parameters: any) => any>(a: Parameters<T>, b: Parameters<T>): boolean => {
  return a.length === b.length && a.every((parameter: any, index: number) => parameter === b[index]);
};

const memoize = <T extends (...parameters: any) => any>(fn: T): T => {
  const cache: Entry<T>[] = [];

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

    const result = fn();

    writeCache(parameters, result);

    return result;
  };

  return memoized as T;
};

export default memoize;
