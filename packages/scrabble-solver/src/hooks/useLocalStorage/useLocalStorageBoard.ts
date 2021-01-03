import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { boardSlice, localStorage, selectBoard, useTypedSelector } from 'state';

const useLocalStorageBoard = () => {
  const dispatch = useDispatch();
  const board = useTypedSelector(selectBoard);

  useEffectOnce(() => {
    if (localStorage.board) {
      dispatch(boardSlice.actions.change(localStorage.board));
    }
  });

  useEffect(() => {
    if (board) {
      localStorage.board = board;
    }
  }, [board]);
};

export default useLocalStorageBoard;
