import { autoUpdate, useFloating } from '@floating-ui/react';

export const useFloatingFocus = () => {
  return useFloating({
    placement: 'top-start',
    whileElementsMounted: autoUpdate,
  });
};
