import classNames from 'classnames';
import { type CSSProperties, type FocusEventHandler, type MouseEventHandler, type ReactElement, useRef } from 'react';
import Highlighter from 'react-highlight-words';

import { useAppLayout, useColumns } from 'hooks';
import { LOCALE_FEATURES } from 'i18n';
import { noop } from 'lib';
import {
  selectIsResultMatching,
  selectLocale,
  selectResultCoordinates,
  selectResultsQuery,
  useTypedSelector,
} from 'state';
import { ResultColumnId } from 'types';

import { Cell } from './Cell';
import styles from './Results.module.scss';
import { type ResultData } from './types';

interface Props {
  data: ResultData;
  index: number;
  style?: CSSProperties;
}

export const Result = ({ data, index, style }: Props): ReactElement => {
  const {
    highlightedIndex,
    results = [],
    onBlur = noop,
    onClick = noop,
    onFocus = noop,
    onMouseEnter = noop,
    onMouseLeave = noop,
  } = data;
  const { resultWordWidth } = useAppLayout();
  const ref = useRef<HTMLButtonElement>(null);
  const columns = useColumns();
  const locale = useTypedSelector(selectLocale);
  const query = useTypedSelector(selectResultsQuery);
  const { direction, separator } = LOCALE_FEATURES[locale];
  const result = results[index];
  const isMatching = useTypedSelector((state) => selectIsResultMatching(state, index));
  const words = direction === 'rtl' ? [...result.words].reverse() : result.words;
  const coordinates = useTypedSelector((state) => selectResultCoordinates(state, index));

  const handleClick: MouseEventHandler = (event) => onClick(result, event);
  const handleMouseEnter: MouseEventHandler = (event) => onMouseEnter(result, event);
  const handleMouseLeave: MouseEventHandler = (event) => onMouseLeave(result, event);
  const handleBlur: FocusEventHandler = (event) => onBlur(result, event);
  const handleFocus: FocusEventHandler = (event) => onFocus(result, event);

  return (
    <button
      aria-hidden={isMatching ? undefined : 'true'}
      aria-label={result.word}
      className={classNames(styles.result, {
        [styles.highlighted]: index === highlightedIndex,
        [styles.notMatching]: !isMatching,
      })}
      data-testid="result"
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
        {columns[ResultColumnId.Coordinates] && (
          <Cell className={styles.coordinates} translationKey="settings.showCoordinates" value={coordinates} />
        )}

        {columns[ResultColumnId.Word] && (
          <Cell
            className={styles.word}
            style={{ flexBasis: resultWordWidth }}
            translationKey="common.word"
            value={result.word}
          >
            <Highlighter highlightClassName={styles.highlight} searchWords={[query]} textToHighlight={result.word} />
          </Cell>
        )}

        {columns[ResultColumnId.TilesCount] && (
          <Cell className={styles.stat} translationKey="common.tiles" value={result.tilesCount} />
        )}

        {columns[ResultColumnId.VowelsCount] && (
          <Cell className={styles.stat} translationKey="common.vowels" value={result.vowelsCount} />
        )}

        {columns[ResultColumnId.ConsonantsCount] && (
          <Cell className={styles.stat} translationKey="common.consonants" value={result.consonantsCount} />
        )}

        {columns[ResultColumnId.BlanksCount] && (
          <Cell className={styles.stat} translationKey="common.blanks" value={result.blanksCount} />
        )}

        {columns[ResultColumnId.WordsCount] && (
          <Cell
            className={styles.stat}
            translationKey="common.words"
            tooltip={`${result.wordsCount.toLocaleString(locale)} (${words.join(separator)})`}
            value={result.wordsCount}
          />
        )}

        {columns[ResultColumnId.Points] && (
          <Cell className={styles.points} dataTestId="points" translationKey="common.points" value={result.points} />
        )}
      </span>
    </button>
  );
};
