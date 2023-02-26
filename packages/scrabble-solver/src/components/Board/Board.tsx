import { autoUpdate, FloatingPortal, offset, shift, useFloating, useMergeRefs } from '@floating-ui/react';
import { FunctionComponent, Ref } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce, useMeasure } from 'react-use';

import { BOARD_CELL_ACTIONS_OFFSET } from 'parameters';
import { boardSlice, cellFilterSlice, selectBoard, selectRowsWithCandidate, useTypedSelector } from 'state';

import styles from './Board.module.scss';
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
  const rows = useTypedSelector(selectRowsWithCandidate);
  const board = useTypedSelector(selectBoard);
  const [actionsMeasureRef, { width: actionsWidth }] = useMeasure<HTMLDivElement>();
  const [{ activeIndex, direction, inputRefs }, { onChange, onDirectionToggle, onFocus, onKeyDown, onPaste }] =
    useGrid(rows);
  const inputRef = inputRefs[activeIndex.y][activeIndex.x];
  const cell = rows[activeIndex.y][activeIndex.x];

  const handleDirectionToggle = () => {
    inputRef.current?.focus();
    onDirectionToggle();
  };

  const handleFocus: typeof onFocus = (x, y) => {
    const newInputRef = inputRefs[y][x];
    refs.setReference(newInputRef.current?.parentElement || null);
    onFocus(x, y);
  };

  const handleToggleBlank = () => {
    inputRef.current?.focus();
    dispatch(boardSlice.actions.toggleCellIsBlank(cell));
  };

  const handleToggleFilterCell = () => {
    inputRef.current?.focus();
    dispatch(cellFilterSlice.actions.toggle(cell));
  };

  const { x, y, strategy, refs } = useFloating({
    middleware: [
      offset({
        mainAxis: -BOARD_CELL_ACTIONS_OFFSET,
        alignmentAxis: BOARD_CELL_ACTIONS_OFFSET - actionsWidth,
      }),
      shift(),
    ],
    placement: 'top-end',
    whileElementsMounted: autoUpdate,
  });

  const actionsRef = useMergeRefs([actionsMeasureRef, refs.setFloating]);

  useEffectOnce(() => {
    refs.setReference(inputRef.current);
  });

  return (
    <>
      <BoardPure
        className={className}
        cellSize={cellSize}
        center={board.center}
        innerRef={innerRef}
        inputRefs={inputRefs}
        rows={rows}
        onChange={onChange}
        // TODO: onBlur on container
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
      />

      <FloatingPortal>
        <Actions
          cell={cell}
          className={styles.actions}
          direction={direction}
          // ref={actionsRef}
          ref={actionsRef}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            visibility: x === null || y === null ? 'hidden' : 'visible',
          }}
          onDirectionToggle={handleDirectionToggle}
          onToggleBlank={handleToggleBlank}
          onToggleFilterCell={handleToggleFilterCell}
        />
      </FloatingPortal>
    </>
  );
};

export default Board;
