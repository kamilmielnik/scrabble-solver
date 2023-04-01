import { useEffect } from 'react';

import {
  localStorage,
  selectAutoGroupTiles,
  selectBoard,
  selectConfigId,
  selectInputMode,
  selectLocale,
  selectRack,
  useTypedSelector,
} from 'state';

const useLocalStorage = () => {
  const autoGroupTiles = useTypedSelector(selectAutoGroupTiles);
  const board = useTypedSelector(selectBoard);
  const configId = useTypedSelector(selectConfigId);
  const inputMode = useTypedSelector(selectInputMode);
  const locale = useTypedSelector(selectLocale);
  const rack = useTypedSelector(selectRack);

  useEffect(() => {
    if (autoGroupTiles) {
      localStorage.setAutoGroupTiles(autoGroupTiles);
    }
  }, [autoGroupTiles]);

  useEffect(() => {
    if (board) {
      localStorage.setBoard(board);
    }
  }, [board]);

  useEffect(() => {
    if (configId) {
      localStorage.setConfigId(configId);
    }
  }, [configId]);

  useEffect(() => {
    if (inputMode) {
      localStorage.setInputMode(inputMode);
    }
  }, [inputMode]);

  useEffect(() => {
    if (locale) {
      localStorage.setLocale(locale);
    }
  }, [locale]);

  useEffect(() => {
    if (rack) {
      localStorage.setRack(rack);
    }
  }, [rack]);
};

export default useLocalStorage;
