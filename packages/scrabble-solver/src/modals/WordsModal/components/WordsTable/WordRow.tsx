import classNames from 'classnames';
import { type ReactElement } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch } from 'react-redux';
import { type RowComponentProps } from 'react-window';

import { Cell, Row } from '@/components/Table';
import Check from '@/icons/Check.svg';
import Cross from '@/icons/Cross.svg';
import {
  hoveredWordSlice,
  selectIsWordMatching,
  selectWordCoordinates,
  selectWordsQuery,
  useTranslate,
  useTypedSelector,
} from '@/state';
import { type VerifiedWord } from '@/types';

import styles from './WordsTable.module.scss';

export interface WordRowData {
  canPreview: boolean;
  highlightedIndex: number;
  usesHover: boolean;
  words: VerifiedWord[];
  onPreview: () => void;
}

export const WordRow = ({
  canPreview,
  highlightedIndex,
  index,
  style,
  usesHover,
  words,
  onPreview,
}: RowComponentProps<WordRowData>): ReactElement => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const isSelected = index === highlightedIndex;
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
    if (!isSelected) {
      handleSet();
    } else if (canPreview) {
      onPreview();
    } else {
      handleClear();
    }
  };

  return (
    <Row
      aria-label={word.word}
      data-testid={`word-${word.x}-${word.y}-${word.direction}`}
      highlighted={isSelected}
      inactive={!isMatching}
      style={style}
      onBlur={usesHover ? handleClear : undefined}
      onClick={usesHover ? undefined : handleClick}
      onFocus={usesHover ? handleSet : undefined}
      onMouseEnter={usesHover ? handleSet : undefined}
    >
      <Cell className={styles.coordinates} translationKey="settings.showCoordinates" value={coordinates} />

      <Cell primary translationKey="common.word" value={word.word}>
        <Highlighter highlightClassName={styles.highlight} searchWords={[query]} textToHighlight={word.word} />
      </Cell>

      <Cell className={styles.stat} value={validityLabel}>
        <Icon
          aria-label={validityLabel}
          className={classNames(styles.icon, word.isValid ? styles.valid : styles.invalid)}
          role="img"
        />
      </Cell>
    </Row>
  );
};
