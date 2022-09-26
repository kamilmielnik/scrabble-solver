import { FunctionComponent, Ref } from 'react';

import { selectRowsWithCandidate, useTypedSelector } from 'state';

import BoardPure from './BoardPure';
import { useGrid } from './hooks';

interface Props {
  cellSize: number;
  className?: string;
  innerRef?: Ref<HTMLDivElement>;
}

const Board: FunctionComponent<Props> = ({ cellSize, className, innerRef }) => {
  const rows = useTypedSelector(selectRowsWithCandidate);
  const [{ lastDirection, refs }, { onDirectionToggle, onFocus, onKeyDown }] = useGrid(rows);

  return (
    <BoardPure
      className={className}
      cellSize={cellSize}
      innerRef={innerRef}
      lastDirection={lastDirection}
      refs={refs}
      rows={rows}
      onDirectionToggle={onDirectionToggle}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
    />
  );
};

export default Board;
