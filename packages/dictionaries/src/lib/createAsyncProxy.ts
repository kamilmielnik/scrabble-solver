type AsyncCallback<T> = () => Promise<T>;

export const createAsyncProxy = <T>(asyncCallback: AsyncCallback<T>): AsyncCallback<T> => {
  let promise: Promise<T> | null = null;

  return async (): Promise<T> => {
    if (promise) {
      return promise;
    }

    try {
      promise = asyncCallback();
      return await promise;
    } finally {
      promise = null;
    }
  };
};
