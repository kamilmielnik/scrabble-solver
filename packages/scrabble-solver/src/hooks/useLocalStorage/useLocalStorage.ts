import useLocalStorageBoard from './useLocalStorageBoard';
import useLocalStorageConfigId from './useLocalStorageConfigId';
import useLocalStorageLocale from './useLocalStorageLocale';
import useLocalStorageTiles from './useLocalStorageTiles';

const useLocalStorage = (): void => {
  useLocalStorageTiles(); // tlles have to go first, see 14869a4
  useLocalStorageBoard();
  useLocalStorageConfigId();
  useLocalStorageLocale();
};

export default useLocalStorage;
