import { autoUpdate, useFloating } from '@floating-ui/react';

const useFloatingFocus = () => {
  return useFloating({
    placement: 'top-start',
    whileElementsMounted: autoUpdate,
  });
};

export default useFloatingFocus;
