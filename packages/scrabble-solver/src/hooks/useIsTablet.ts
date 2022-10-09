import { useMedia } from 'react-use';

const useIsTablet = (): boolean => {
  const isTabletHeight = useMedia('(max-height: 800px)', false);
  const isTabletWidth = useMedia('(max-width: 1024px)', false);
  const isTablet = isTabletHeight || isTabletWidth;
  return isTablet;
};

export default useIsTablet;
