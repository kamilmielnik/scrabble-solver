import { type BoardWord } from '@scrabble-solver/types';
import classNames from 'classnames';
import { type ReactElement } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch } from 'react-redux';
import { type RowComponentProps } from 'react-window';

import { Cell } from '@/components/Table';
import tableStyles from '@/components/Table/Table.module.scss';
import Check from '@/icons/Check.svg';
import Cross from '@/icons/Cross.svg';
import {
  hoveredWordSlice,
  selectHoveredWord,
  selectIsWordMatching,
  selectWordCoordinates,
  selectWordsQuery,
  useTranslate,
  useTypedSelector,
  useTypedStore,
} from '@/state';

import styles from './WordsTable.module.scss';

export interface WordRowData {
  isTouchDevice: boolean;
  words: BoardWord[];
}

export const WordRow = ({ index, isTouchDevice, style, words }: RowComponentProps<WordRowData>): ReactElement => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const store = useTypedStore();
  const word = words[index];
  const coordinates = useTypedSelector((state) => selectWordCoordinates(state, index));
  const isMatching = useTypedSelector((state) => selectIsWordMatching(state, index));
  const query = useTypedSelector(selectWordsQuery);
  const validityLabel = translate(word.isValid ? 'words.valid' : 'words.invalid');
  const Icon = word.isValid ? Check : Cross;

  const handleSet = () => {
    dispatch(hoveredWordSlice.actions.set(word));
  };

  const handleClear = () => {
    dispatch(hoveredWordSlice.actions.clear());
  };

  const handleClick = () => {
    if (selectHoveredWord(store.getState()) === word) {
      dispatch(hoveredWordSlice.actions.clear());
    } else {
      dispatch(hoveredWordSlice.actions.set(word));
    }
  };

  return (
    <button
      aria-hidden={isMatching ? undefined : 'true'}
      aria-label={word.word}
      className={tableStyles.row}
      data-testid={`word-${word.x}-${word.y}-${word.direction}`}
      style={style}
      type="button"
      onBlur={isTouchDevice ? undefined : handleClear}
      onClick={isTouchDevice ? handleClick : undefined}
      onFocus={isTouchDevice ? undefined : handleSet}
      onMouseEnter={isTouchDevice ? undefined : handleSet}
    >
      <span className={tableStyles.rowContent}>
        <Cell className={styles.coordinates} translationKey="settings.showCoordinates" value={coordinates} />

        <Cell className={classNames(styles.word, tableStyles.start)} translationKey="common.word" value={word.word}>
          <Highlighter highlightClassName={styles.highlight} searchWords={[query]} textToHighlight={word.word} />
        </Cell>

        <Cell className={styles.stat} value={validityLabel}>
          <Icon
            aria-label={validityLabel}
            className={classNames(styles.icon, word.isValid ? styles.valid : styles.invalid)}
            role="img"
          />
        </Cell>
      </span>
    </button>
  );
};
