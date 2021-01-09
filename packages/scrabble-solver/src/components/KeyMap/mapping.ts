import Key from '../Key';

const mapping = {
  navigate: [Key.ARROW_LEFT, Key.ARROW_UP, Key.ARROW_DOWN, Key.ARROW_RIGHT],
  insertBlank: [Key.SPACE],
  insertTile: [Key.A, Key.B, Key.C],
  removeTile: [Key.DEL, Key.BACKSPACE],
  submit: [Key.ENTER],
  toggleBlank: [[Key.CTRL, Key.B]],
  horizontalDirection: [
    [Key.CTRL, Key.ARROW_LEFT],
    [Key.CTRL, Key.ARROW_RIGHT],
  ],
  verticalDirection: [
    [Key.CTRL, Key.ARROW_UP],
    [Key.CTRL, Key.ARROW_DOWN],
  ],
};

export default mapping;
