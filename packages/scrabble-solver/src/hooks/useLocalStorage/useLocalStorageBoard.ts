import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { boardSlice, localStorage, selectBoard, useTypedSelector } from 'state';

const useLocalStorageBoard = (): void => {
  const dispatch = useDispatch();
  const board = useTypedSelector(selectBoard);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffectOnce(() => {
    const persistedBoard = localStorage.getBoard();

    if (persistedBoard) {
      dispatch(boardSlice.actions.init(persistedBoard));
    }

    setIsLoaded(true);
  });

  useEffect(() => {
    if (board && isLoaded) {
      localStorage.setBoard(board);
    }
  }, [board, isLoaded]);
};

export default useLocalStorageBoard;
