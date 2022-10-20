import { FunctionComponent, Ref } from 'react';

import { selectBoard, selectRowsWithCandidate, useTypedSelector } from 'state';

import BoardPure from './BoardPure';
import { useGrid } from './hooks';

interface Props {
  cellSize: number;
  className?: string;
  innerRef?: Ref<HTMLDivElement>;
}

const Board: FunctionComponent<Props> = ({ cellSize, className, innerRef }) => {
  const rows = useTypedSelector(selectRowsWithCandidate);
  const board = useTypedSelector(selectBoard);
  const [{ direction, refs }, { onChange, onDirectionToggle, onFocus, onKeyDown, onPaste }] = useGrid(rows);

  return (
    <BoardPure
      className={className}
      cellSize={cellSize}
      center={board.center}
      direction={direction}
      innerRef={innerRef}
      refs={refs}
      rows={rows}
      onChange={onChange}
      onDirectionToggle={onDirectionToggle}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
    />
  );
};

export default Board;
