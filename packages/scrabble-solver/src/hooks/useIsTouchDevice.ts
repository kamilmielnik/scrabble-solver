import { useMedia } from 'react-use';

const useIsTouchDevice = () => {
  return useMedia('(hover: none)', false);
};

export default useIsTouchDevice;
