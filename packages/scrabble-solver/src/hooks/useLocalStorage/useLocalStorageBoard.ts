import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { boardSlice, localStorage, selectBoard, useTypedSelector } from 'state';

const useLocalStorageBoard = () => {
  const dispatch = useDispatch();
  const board = useTypedSelector(selectBoard);

  useEffectOnce(() => {
    const persistedBoard = localStorage.getBoard();

    if (persistedBoard) {
      dispatch(boardSlice.actions.init(persistedBoard));
    }
  });

  useEffect(() => {
    if (board) {
      localStorage.setBoard(board);
    }
  }, [board]);
};

export default useLocalStorageBoard;
