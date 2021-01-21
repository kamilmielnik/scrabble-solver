import React, { FunctionComponent } from 'react';

import { selectRowsWithCandidate, useTypedSelector } from 'state';

import BoardView from './BoardView';
import { useGrid } from './hooks';

interface Props {
  className?: string;
  cellSize: number;
}

const Board: FunctionComponent<Props> = ({ className, cellSize }) => {
  const rows = useTypedSelector(selectRowsWithCandidate);
  const [{ lastDirection, refs }, { onDirectionToggle, onFocus, onKeyDown, onMoveFocus }] = useGrid({
    height: rows.length,
    width: rows[0].length,
  });

  return (
    <BoardView
      className={className}
      cellSize={cellSize}
      lastDirection={lastDirection}
      refs={refs}
      rows={rows}
      onFocus={onFocus}
      onDirectionToggle={onDirectionToggle}
      onKeyDown={onKeyDown}
      onMoveFocus={onMoveFocus}
    />
  );
};

export default Board;
