import useMedia from './useMedia';

const useIsTouchDevice = () => {
  return useMedia('(hover: none)', false);
};

export default useIsTouchDevice;
