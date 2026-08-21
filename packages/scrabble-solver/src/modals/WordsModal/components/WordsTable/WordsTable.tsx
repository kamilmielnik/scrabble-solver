import { isSameBoardWord } from '@scrabble-solver/types';
import classNames from 'classnames';
import { type FunctionComponent, useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { List } from 'react-window';

import { EmptyState } from '@/components/EmptyState';
import { Header, HeaderButton, Search } from '@/components/Table';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LOCALE_FEATURES } from '@/i18n/constants';
import GeoAlt from '@/icons/GeoAlt.svg';
import QuestionSquare from '@/icons/QuestionSquare.svg';
import { RESULTS_ITEM_HEIGHT, RESULTS_OVERSCAN_COUNT } from '@/parameters';
import {
  hoveredWordSlice,
  selectHoveredWord,
  selectLocale,
  selectProcessedWords,
  selectWordsQuery,
  selectWordsSort,
  useTranslate,
  useTypedSelector,
  verifySlice,
} from '@/state';
import { WordColumnId } from '@/types';

import { WordRow, type WordRowData } from './WordRow';
import styles from './WordsTable.module.scss';

interface Props {
  canPreview: boolean;
  className?: string;
  isOpen: boolean;
  onPreview: () => void;
}

export const WordsTable: FunctionComponent<Props> = ({ canPreview, className, isOpen, onPreview }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const isTouchDevice = useIsTouchDevice();
  const selectsFirstWord = useMediaQuery('<l');
  const usesHover = !isTouchDevice && !selectsFirstWord;
  const locale = useTypedSelector(selectLocale);
  const { direction } = LOCALE_FEATURES[locale];
  const words = useTypedSelector(selectProcessedWords);
  const query = useTypedSelector(selectWordsQuery);
  const sort = useTypedSelector(selectWordsSort);
  const hoveredWord = useTypedSelector(selectHoveredWord);
  const highlightedIndex = hoveredWord ? words.findIndex((word) => isSameBoardWord(word, hoveredWord)) : -1;
  const rowProps = useMemo<WordRowData>(
    () => ({ canPreview, highlightedIndex, usesHover, words, onPreview }),
    [canPreview, highlightedIndex, usesHover, words, onPreview],
  );

  const handleSort = useCallback(
    (columnId: WordColumnId) => {
      dispatch(verifySlice.actions.sort(columnId));
    },
    [dispatch],
  );

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      dispatch(verifySlice.actions.changeQuery(newQuery));
    },
    [dispatch],
  );

  const handleMouseLeave = useCallback(() => {
    dispatch(hoveredWordSlice.actions.clear());
  }, [dispatch]);

  useEffect(() => {
    if (isOpen && selectsFirstWord && words.length > 0 && highlightedIndex === -1) {
      dispatch(hoveredWordSlice.actions.set(words[0]));
    }
  }, [dispatch, highlightedIndex, isOpen, selectsFirstWord, words]);

  return (
    <div
      aria-label={translate('words')}
      className={classNames(styles.words, className)}
      data-testid="words"
      role="region"
    >
      <Header>
        <HeaderButton
          className={styles.coordinates}
          Icon={GeoAlt}
          id={WordColumnId.Coordinates}
          sort={sort}
          translationKey="settings.showCoordinates"
          onSort={handleSort}
        />

        <HeaderButton id={WordColumnId.Word} primary sort={sort} translationKey="common.word" onSort={handleSort} />

        <HeaderButton
          className={styles.stat}
          Icon={QuestionSquare}
          id={WordColumnId.Validity}
          sort={sort}
          translationKey="words.validity"
          onSort={handleSort}
        />
      </Header>

      <div aria-live="polite" className={styles.content}>
        {words.length === 0 && <EmptyState variant="info">{translate('words.empty-state.no-words')}</EmptyState>}

        {words.length > 0 && (
          <div className={styles.listContainer}>
            <List
              className={styles.list}
              dir={direction}
              overscanCount={RESULTS_OVERSCAN_COUNT}
              rowComponent={WordRow}
              rowCount={words.length}
              rowHeight={RESULTS_ITEM_HEIGHT}
              rowProps={rowProps}
              onMouseLeave={usesHover ? handleMouseLeave : undefined}
            />
          </div>
        )}
      </div>

      {words.length > 0 && (
        <Search
          className={styles.input}
          placeholder={translate('words.input.placeholder')}
          value={query}
          onChange={handleQueryChange}
        />
      )}
    </div>
  );
};
