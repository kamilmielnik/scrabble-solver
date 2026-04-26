import { useEffect } from 'react';

import { localStorage, selectBoard, selectRack, selectSettings, useTypedSelector } from '@/state';

export const useLocalStorage = () => {
  const board = useTypedSelector(selectBoard);
  const rack = useTypedSelector(selectRack);
  const settings = useTypedSelector(selectSettings);

  useEffect(() => {
    if (board) {
      localStorage.setBoard(board);
    }
  }, [board]);

  useEffect(() => {
    if (rack) {
      localStorage.setRack(rack);
    }
  }, [rack]);

  useEffect(() => {
    localStorage.setSettings(settings);
  }, [settings]);
};
