import { useRef } from 'react';

interface Latest<T> {
  readonly current: T;
}

const useLatest = <T>(value: T): Latest<T> => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};

export default useLatest;
