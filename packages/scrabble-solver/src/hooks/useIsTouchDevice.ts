import { useMedia } from './useMedia';

export const useIsTouchDevice = () => {
  return useMedia('(hover: none)', false);
};
