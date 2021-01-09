import Key from '../Key';

const mapping = {
  directionHorizontal: [
    [Key.CTRL, Key.ARROW_LEFT],
    [Key.CTRL, Key.ARROW_RIGHT],
  ],
  directionVertical: [
    [Key.CTRL, Key.ARROW_UP],
    [Key.CTRL, Key.ARROW_DOWN],
  ],
  insertBlank: [Key.SPACE],
  insertTile: [Key.A, Key.B, Key.C],
  navigate: [Key.ARROW_LEFT, Key.ARROW_UP, Key.ARROW_DOWN, Key.ARROW_RIGHT],
  removeTile: [Key.DEL, Key.BACKSPACE],
  submit: [Key.ENTER],
  toggleBlank: [[Key.CTRL, Key.B]],
};

export default mapping;
