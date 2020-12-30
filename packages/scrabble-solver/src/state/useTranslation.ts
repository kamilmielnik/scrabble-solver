import { selectTranslation } from './selectors';
import useTypedSelector from './useTypedSelector';

const useTranslation = (id: string): string => {
  const translation = useTypedSelector((state) => selectTranslation(state, id));
  return translation;
};

export default useTranslation;
