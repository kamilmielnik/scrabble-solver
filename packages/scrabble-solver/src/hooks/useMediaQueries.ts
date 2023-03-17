import useMediaQuery from './useMediaQuery';

const useMediaQueries = () => {
  const isLessThanXs = useMediaQuery('<xs', true);
  const isLessThanS = useMediaQuery('<s', true);
  const isLessThanM = useMediaQuery('<m', true);
  const isLessThanL = useMediaQuery('<l', true);
  const isLessThanXl = useMediaQuery('<xl', true);

  return { isLessThanXs, isLessThanS, isLessThanM, isLessThanL, isLessThanXl };
};

export default useMediaQueries;
