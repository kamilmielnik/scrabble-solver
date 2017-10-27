import styles from './styles.scss';

export default (config) => {
  const offsets = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -config.boardWidth,
    ArrowDown: config.boardWidth
  };
  const boardSize = config.boardWidth * config.boardHeight;
  const arrowKeys = Object.keys(offsets);

  const getNextInput = ({ key, target }) => {
    const inputs = getAllBoardInputs();
    const inputIndex = inputs.indexOf(target);
    const nextInputIndex = getNextInputIndex(inputIndex, offsets[key]);
    return inputs[nextInputIndex];
  };

  const getNextInputIndex = (inputIndex, offset) => {
    const nextInputIndex = inputIndex + offset;
    if (nextInputIndex < 0) {
      return nextInputIndex + boardSize;
    } else if (nextInputIndex >= boardSize) {
      return nextInputIndex - boardSize;
    }
    return nextInputIndex;
  };

  return {
    handleArrowKeys: (event) => getNextInput(event).focus(),
    isArrowKey: ({ key }) => arrowKeys.includes(key),
    isCharacter: ({ key }) => config.alphabet.includes(key),
    isRemovingCharacter: ({ key }) => [ 'Delete', 'Backspace', ' ' ].includes(key),
    isSubmitting: ({ key }) => key === 'Enter',
    isTogglingBlank: ({ ctrlKey, metaKey, key }) => (ctrlKey || metaKey) && key === 'b'
  };
};

const getAllBoardInputs = () => Array.from(document.querySelectorAll(`.${styles.board} input`));
