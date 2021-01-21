import useLocalStorageBoard from './useLocalStorageBoard';
import useLocalStorageConfigId from './useLocalStorageConfigId';
import useLocalStorageLocale from './useLocalStorageLocale';
import useLocalStorageRack from './useLocalStorageRack';

const useLocalStorage = (): void => {
  useLocalStorageRack(); // rack has to go first, see 14869a4
  useLocalStorageBoard();
  useLocalStorageConfigId();
  useLocalStorageLocale();
};

export default useLocalStorage;
