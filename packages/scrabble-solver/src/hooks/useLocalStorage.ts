import { useEffect, useRef } from 'react';

import {
  localStorage,
  selectActiveBoardId,
  selectBoard,
  selectBoards,
  selectCellFilters,
  selectIsHydrated,
  selectRack,
  selectSettings,
  useTypedSelector,
} from '@/state';

type WriteFlags = {
  activeBoard: boolean;
  boards: boolean;
  settings: boolean;
};

export const useLocalStorage = () => {
  const isHydrated = useTypedSelector(selectIsHydrated);
  const activeId = useTypedSelector(selectActiveBoardId);
  const board = useTypedSelector(selectBoard);
  const rack = useTypedSelector(selectRack);
  const cellFilters = useTypedSelector(selectCellFilters);
  const boards = useTypedSelector(selectBoards);
  const settings = useTypedSelector(selectSettings);
  const hasSkippedFirstWrite = useRef<WriteFlags>({
    activeBoard: false,
    boards: false,
    settings: false,
  });

  /*
   * The active board is written on its own, under its own key, because it
   * changes on every keystroke while the rest of the collection does not.
   */
  useEffect(() => {
    if (isHydrated && board && !isFirstWriteAfterHydration(hasSkippedFirstWrite.current, 'activeBoard')) {
      localStorage.setBoardSnapshot(activeId, { board: board.toJson(), cellFilters, rack });
    }
  }, [activeId, board, cellFilters, isHydrated, rack]);

  useEffect(() => {
    if (isHydrated && !isFirstWriteAfterHydration(hasSkippedFirstWrite.current, 'boards')) {
      const { saved, ...metadata } = boards;
      localStorage.setBoards(metadata, saved);
    }
  }, [boards, isHydrated]);

  useEffect(() => {
    if (isHydrated && !isFirstWriteAfterHydration(hasSkippedFirstWrite.current, 'settings')) {
      localStorage.setSettings(settings);
    }
  }, [isHydrated, settings]);
};

// Each effect's first post-hydration run would only write back what hydration just read, so it is skipped
function isFirstWriteAfterHydration(flags: WriteFlags, key: keyof WriteFlags): boolean {
  if (flags[key]) {
    return false;
  }

  flags[key] = true;
  return true;
}
