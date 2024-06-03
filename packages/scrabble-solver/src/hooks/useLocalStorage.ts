import { useEffect } from 'react';

import {
  localStorage,
  selectAutoGroupTiles,
  selectBoard,
  selectGame,
  selectInputMode,
  selectLocale,
  selectRack,
  selectShowCoordinates,
  useTypedSelector,
} from 'state';

const useLocalStorage = () => {
  const autoGroupTiles = useTypedSelector(selectAutoGroupTiles);
  const board = useTypedSelector(selectBoard);
  const game = useTypedSelector(selectGame);
  const inputMode = useTypedSelector(selectInputMode);
  const locale = useTypedSelector(selectLocale);
  const rack = useTypedSelector(selectRack);
  const showCoordinates = useTypedSelector(selectShowCoordinates);

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
    if (game) {
      localStorage.setGame(game);
    }
  }, [game]);

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

  useEffect(() => {
    if (showCoordinates) {
      localStorage.setShowCoordinates(showCoordinates);
    }
  }, [showCoordinates]);
};

export default useLocalStorage;
