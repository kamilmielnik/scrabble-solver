import { useEffect } from 'react';

const useOnWindowResize = (onResize: (event: Event) => void) => {
  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);
};

export default useOnWindowResize;
