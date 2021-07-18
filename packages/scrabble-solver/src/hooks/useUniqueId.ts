import { useRef } from 'react';
import { v4 } from 'uuid';

const useUniqueId = (): string => {
  const idRef = useRef(v4());
  return idRef.current;
};

export default useUniqueId;
