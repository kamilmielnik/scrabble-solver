import { type BoardWord, isSameBoardWord } from '@scrabble-solver/types';
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
  highlightedIndex: number;
  isPreviewMode: boolean;
  isTouchDevice: boolean;
  words: BoardWord[];
  onPreview: () => void;
}

export const WordRow = ({
  highlightedIndex,
  index,
  isPreviewMode,
  isTouchDevice,
  style,
  words,
  onPreview,
}: RowComponentProps<WordRowData>): ReactElement => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const store = useTypedStore();
  const usesHover = !isTouchDevice && !isPreviewMode;
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
    const hoveredWord = selectHoveredWord(store.getState());
    const isSelected = hoveredWord !== null && isSameBoardWord(hoveredWord, word);

    if (!isSelected) {
      dispatch(hoveredWordSlice.actions.set(word));
    } else if (isPreviewMode) {
      onPreview();
    } else {
      dispatch(hoveredWordSlice.actions.clear());
    }
  };

  return (
    <button
      aria-current={index === highlightedIndex ? 'true' : undefined}
      aria-hidden={isMatching ? undefined : 'true'}
      aria-label={word.word}
      className={classNames(tableStyles.row, {
        [tableStyles.highlighted]: index === highlightedIndex,
      })}
      data-testid={`word-${word.x}-${word.y}-${word.direction}`}
      style={style}
      type="button"
      onBlur={usesHover ? handleClear : undefined}
      onClick={usesHover ? undefined : handleClick}
      onFocus={usesHover ? handleSet : undefined}
      onMouseEnter={usesHover ? handleSet : undefined}
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
