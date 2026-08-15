import { useEffect, useRef } from 'react';

import { localStorage, selectBoard, selectIsHydrated, selectRack, selectSettings, useTypedSelector } from '@/state';

type WriteFlags = {
  board: boolean;
  rack: boolean;
  settings: boolean;
};

export const useLocalStorage = () => {
  const isHydrated = useTypedSelector(selectIsHydrated);
  const board = useTypedSelector(selectBoard);
  const rack = useTypedSelector(selectRack);
  const settings = useTypedSelector(selectSettings);
  const hasSkippedFirstWrite = useRef<WriteFlags>({
    board: false,
    rack: false,
    settings: false,
  });

  useEffect(() => {
    if (isHydrated && board && !isFirstWriteAfterHydration(hasSkippedFirstWrite.current, 'board')) {
      localStorage.setBoard(board);
    }
  }, [isHydrated, board]);

  useEffect(() => {
    if (isHydrated && rack && !isFirstWriteAfterHydration(hasSkippedFirstWrite.current, 'rack')) {
      localStorage.setRack(rack);
    }
  }, [isHydrated, rack]);

  useEffect(() => {
    if (isHydrated && !isFirstWriteAfterHydration(hasSkippedFirstWrite.current, 'settings')) {
      localStorage.setSettings(settings);
    }
  }, [isHydrated, settings]);
};

// Each effect's first post-hydration run would only write back what hydration just read, so it is skipped.
function isFirstWriteAfterHydration(flags: WriteFlags, key: keyof WriteFlags): boolean {
  if (flags[key]) {
    return false;
  }

  flags[key] = true;
  return true;
}
