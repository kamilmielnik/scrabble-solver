interface Entry<T extends (...parameters: any) => any> {
  parameters: Parameters<T>;
  result: ReturnType<T>;
}

const memoize = <T extends (...parameters: any) => any>(fn: T): T => {
  const cache: Entry<T>[] = [];

  const readCache = (...parameters: Parameters<T>): ReturnType<T> | undefined => {
    const cached = cache.find((entry) => {
      return (
        entry.parameters.length === parameters.length &&
        entry.parameters.every((parameter: any, index: number) => parameter === parameters[index])
      );
    });

    return cached?.result;
  };

  const writeCache = (parameters: Parameters<T>, result: ReturnType<T>): void => {
    cache.push({ parameters, result });
  };

  const memoized = (...parameters: Parameters<T>): ReturnType<T> => {
    const cached = readCache(...parameters);

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
