import useMediaQuery from './useMediaQuery';

const useMediaQueries = () => {
  const isLessThanXs = useMediaQuery('<xs');
  const isLessThanS = useMediaQuery('<s');
  const isLessThanM = useMediaQuery('<m');
  const isLessThanL = useMediaQuery('<l');
  const isLessThanXl = useMediaQuery('<xl');

  return { isLessThanXs, isLessThanS, isLessThanM, isLessThanL, isLessThanXl };
};

export default useMediaQueries;
