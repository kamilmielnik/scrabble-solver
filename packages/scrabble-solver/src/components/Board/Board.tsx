import { EMPTY_CELL } from '@scrabble-solver/constants';
import { FunctionComponent, Ref } from 'react';
import { useDispatch } from 'react-redux';

import {
  boardSlice,
  cellFilterSlice,
  selectBoard,
  selectCellIsFiltered,
  selectRowsWithCandidate,
  useTranslate,
  useTypedSelector,
} from 'state';

import BoardPure from './BoardPure';
import { Actions } from './components';
import { useGrid } from './hooks';

interface Props {
  cellSize: number;
  className?: string;
  innerRef?: Ref<HTMLDivElement>;
}

const Board: FunctionComponent<Props> = ({ cellSize, className, innerRef }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const rows = useTypedSelector(selectRowsWithCandidate);
  const board = useTypedSelector(selectBoard);
  const [{ activeIndex, direction, refs }, { onChange, onDirectionToggle, onFocus, onKeyDown, onPaste }] =
    useGrid(rows);
  const inputRef = refs[activeIndex.y][activeIndex.x];
  const cell = rows[activeIndex.y][activeIndex.x];
  const isFiltered = useTypedSelector((state) => selectCellIsFiltered(state, cell));
  const isEmpty = cell.tile.character === EMPTY_CELL;

  const handleDirectionToggle = () => {
    inputRef.current?.focus();
    onDirectionToggle();
  };

  const handleToggleBlank = () => {
    inputRef.current?.focus();
    dispatch(boardSlice.actions.toggleCellIsBlank(cell));
  };

  const handleToggleFilterCell = () => {
    inputRef.current?.focus();
    dispatch(cellFilterSlice.actions.toggle(cell));
  };

  return (
    <>
      <BoardPure
        className={className}
        cellSize={cellSize}
        center={board.center}
        innerRef={innerRef}
        refs={refs}
        rows={rows}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
      />

      <Actions
        direction={direction}
        isBlank={cell.tile.isBlank}
        isEmpty={isEmpty}
        isFiltered={isFiltered}
        translate={translate}
        onDirectionToggle={handleDirectionToggle}
        onToggleBlank={handleToggleBlank}
        onToggleFilterCell={handleToggleFilterCell}
      />
    </>
  );
};

export default Board;
