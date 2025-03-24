import { useMediaQuery } from './useMediaQuery';

export const useMediaQueries = () => {
  const isLessThanXs = useMediaQuery('<xs');
  const isLessThanS = useMediaQuery('<s');
  const isLessThanM = useMediaQuery('<m');
  const isLessThanL = useMediaQuery('<l');
  const isLessThanXl = useMediaQuery('<xl');

  return { isLessThanXs, isLessThanS, isLessThanM, isLessThanL, isLessThanXl };
};
