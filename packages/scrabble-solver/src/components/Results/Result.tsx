import classNames from 'classnames';
import { CSSProperties, FocusEventHandler, MouseEventHandler, ReactElement, useRef } from 'react';

import { LOCALE_FEATURES } from 'i18n';
import { noop } from 'lib';
import { selectIsResultMatching, selectLocale, useTypedSelector } from 'state';
import { ResultColumn } from 'types';

import Cell from './Cell';
import styles from './Results.module.scss';
import { ResultData } from './types';
import useColumns from './useColumns';

interface Props {
  data: ResultData;
  index: number;
  style?: CSSProperties;
}

const Result = ({ data, index, style }: Props): ReactElement => {
  const {
    highlightedIndex,
    results = [],
    onBlur = noop,
    onClick = noop,
    onFocus = noop,
    onMouseEnter = noop,
    onMouseLeave = noop,
  } = data;
  const ref = useRef<HTMLButtonElement>(null);
  const columns = useColumns();
  const locale = useTypedSelector(selectLocale);
  const { consonants, vowels } = LOCALE_FEATURES[locale];
  const result = results[index];
  const isMatching = useTypedSelector((state) => selectIsResultMatching(state, index));
  const otherWords = result.words.slice(1).join(' / ').toLocaleUpperCase();
  const enabledColumns = Object.fromEntries(columns.map((column) => [column.id, true]));

  const handleClick: MouseEventHandler = (event) => onClick(result, event);
  const handleMouseEnter: MouseEventHandler = (event) => onMouseEnter(result, event);
  const handleMouseLeave: MouseEventHandler = (event) => onMouseLeave(result, event);
  const handleBlur: FocusEventHandler = (event) => onBlur(result, event);
  const handleFocus: FocusEventHandler = (event) => onFocus(result, event);

  return (
    <button
      aria-label={result.word}
      className={classNames(styles.result, {
        [styles.highlighted]: index === highlightedIndex,
        [styles.notMatching]: !isMatching,
      })}
      ref={ref}
      style={style}
      type="button"
      onBlur={handleBlur}
      onClick={handleClick}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={styles.resultContent}>
        {enabledColumns[ResultColumn.Word] && (
          <Cell
            className={styles.word}
            translationKey="common.word"
            value={`${result.word.toLocaleUpperCase()}${otherWords.length > 0 ? ` (${otherWords})` : ''}`}
          />
        )}

        {enabledColumns[ResultColumn.TilesCount] && (
          <Cell className={styles.stat} translationKey="common.tiles" value={result.tilesCount} />
        )}

        {enabledColumns[ResultColumn.ConsonantsCount] && consonants && (
          <Cell className={styles.stat} translationKey="common.consonants" value={result.consonantsCount} />
        )}

        {enabledColumns[ResultColumn.VowelsCount] && vowels && (
          <Cell className={styles.stat} translationKey="common.vowels" value={result.vowelsCount} />
        )}

        {enabledColumns[ResultColumn.BlanksCount] && (
          <Cell className={styles.stat} translationKey="common.blanks" value={result.blanksCount} />
        )}

        {enabledColumns[ResultColumn.WordsCount] && (
          <Cell
            className={styles.stat}
            translationKey="common.words"
            tooltip={`${result.wordsCount} (${result.words.join(' / ').toLocaleUpperCase()})`}
            value={result.wordsCount}
          />
        )}

        {enabledColumns[ResultColumn.Points] && (
          <Cell className={styles.points} translationKey="common.points" value={result.points} />
        )}
      </span>
    </button>
  );
};

export default Result;
