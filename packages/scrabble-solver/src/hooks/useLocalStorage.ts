import { useEffect } from 'react';

import { localStorage, selectBoard, selectIsHydrated, selectRack, selectSettings, useTypedSelector } from '@/state';

export const useLocalStorage = () => {
  const isHydrated = useTypedSelector(selectIsHydrated);
  const board = useTypedSelector(selectBoard);
  const rack = useTypedSelector(selectRack);
  const settings = useTypedSelector(selectSettings);

  useEffect(() => {
    if (isHydrated && board) {
      localStorage.setBoard(board);
    }
  }, [isHydrated, board]);

  useEffect(() => {
    if (isHydrated && rack) {
      localStorage.setRack(rack);
    }
  }, [isHydrated, rack]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setSettings(settings);
    }
  }, [isHydrated, settings]);
};
