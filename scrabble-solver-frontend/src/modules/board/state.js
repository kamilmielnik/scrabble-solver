import { createAction, handleActions } from 'redux-actions';
import { EMPTY_CELL } from 'scrabble-solver-commons/constants';
import { Board, Cell, Tile } from 'scrabble-solver-commons/models';
import { initialState as config } from 'modules/config/state';

export const APPLY_RESULT = 'board/apply-result';
export const CHANGE_CELL_VALUE = 'board/change-cell-value';
export const TOGGLE_CELL_IS_BLANK = 'board/toggle-cell-is-blank';

export const applyResult = createAction(APPLY_RESULT);
export const changeCellValue = createAction(CHANGE_CELL_VALUE, (x, y, value) => ({ x, y, value }));
export const toggleCellIsBlank = createAction(TOGGLE_CELL_IS_BLANK, (x, y) => ({ x, y }));

const initialState = Board.fromStringArray(Array(config.boardHeight).fill(
  Array(config.boardWidth).fill(' ').join('')
));

export default handleActions({
  [APPLY_RESULT]: (state, { payload: result }) => new Board({
    board: (state.board.map(
      (row, y) => row.map(
        (cell, x) => {
          const newCell = getCell(result.cells, x, y);
          if(newCell) {
            return new Cell({
              ...newCell,
              isEmpty: false
            });
          }
          return cell;
        }
      )
    ))
  }),

  [CHANGE_CELL_VALUE]: (state, { payload: { x, y, value } }) => {
    const isEmpty = !value || value === EMPTY_CELL;
    return updateBoardCell(state, y, x, (cell) => new Cell({
      ...cell,
      tile: isEmpty ? Tile.NullTile : new Tile({ character: value }),
      isEmpty
    }));
  },

  [TOGGLE_CELL_IS_BLANK]: (state, { payload: { x, y } }) => updateBoardCell(state, y, x, (cell) => new Cell({
    ...cell,
    tile: cell.isEmpty ? cell.tile : new Tile({
      ...cell.tile,
      isBlank: !cell.tile.isBlank
    })
  }))
}, initialState);

const updateBoardCell = (state, y, x, updateCell) => updateBoardRow(state, y, (row) => [
  ...row.slice(0, x),
  updateCell(row[x]),
  ...row.slice(x + 1)
]);

const updateBoardRow = (state, y, updateRow) => new Board({
  board: ([
    ...state.board.slice(0, y),
    updateRow(state.board[y]),
    ...state.board.slice(y + 1)
  ])
});

const getCell = (cells, x, y) => cells.find((cell) => cell.x === x && cell.y === y);
