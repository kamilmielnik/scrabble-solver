import { type FocusEventHandler, type MouseEventHandler, type ReactElement } from 'react';
import Highlighter from 'react-highlight-words';
import { type RowComponentProps } from 'react-window';

import { Cell, Row } from '@/components/Table';
import { useColumns } from '@/hooks/useColumns';
import { LOCALE_FEATURES } from '@/i18n/constants';
import { noop } from '@/lib/noop';
import {
  selectIsResultMatching,
  selectLocale,
  selectResultCoordinates,
  selectResultsQuery,
  useTypedSelector,
} from '@/state';
import { ResultColumnId } from '@/types';

import styles from './Results.module.scss';
import { type ResultData } from './types';

export const Result = ({
  index,
  highlightedIndex,
  results = [],
  onBlur = noop,
  onClick = noop,
  onFocus = noop,
  onMouseEnter = noop,
  style,
}: RowComponentProps<ResultData>): ReactElement => {
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
  const handleBlur: FocusEventHandler = (event) => onBlur(result, event);
  const handleFocus: FocusEventHandler = (event) => onFocus(result, event);

  return (
    <Row
      aria-label={result.word}
      className={styles.result}
      data-testid="result"
      highlighted={index === highlightedIndex}
      isMatching={isMatching}
      style={style}
      onBlur={handleBlur}
      onClick={handleClick}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
    >
      {columns[ResultColumnId.Coordinates] && (
        <Cell className={styles.coordinates} translationKey="settings.showCoordinates" value={coordinates} />
      )}

      {columns[ResultColumnId.Word] && (
        <Cell className={styles.word} start translationKey="common.word" value={result.word}>
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
        <Cell className={styles.points} data-testid="points" translationKey="common.points" value={result.points} />
      )}
    </Row>
  );
};
