import { isSameBoardWord } from '@scrabble-solver/types';
import classNames from 'classnames';
import { type FunctionComponent, useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { List } from 'react-window';

import { EmptyState } from '@/components/EmptyState';
import { Header, HeaderButton, ListContainer, Search } from '@/components/Table';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePointerHighlight } from '@/hooks/usePointerHighlight';
import { LOCALE_FEATURES } from '@/i18n/constants';
import GeoAlt from '@/icons/GeoAlt.svg';
import QuestionSquare from '@/icons/QuestionSquare.svg';
import { RESULTS_ITEM_HEIGHT, RESULTS_OVERSCAN_COUNT } from '@/parameters';
import {
  hoveredWordSlice,
  selectHoveredWord,
  selectLocale,
  selectProcessedWords,
  selectVerifyError,
  selectWordsQuery,
  selectWordsSort,
  useTranslate,
  useTypedSelector,
  verifySlice,
} from '@/state';
import { type VerifiedWord, WordColumnId } from '@/types';

import { type WordRowData, WordRow } from './WordRow';
import styles from './WordsTable.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onPreview: () => void;
}

export const WordsTable: FunctionComponent<Props> = ({ className, isOpen, onPreview }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const isTouchDevice = useIsTouchDevice();
  const isCompactLayout = useMediaQuery('<l');
  const highlightFollowsPointer = !isTouchDevice && !isCompactLayout;
  const locale = useTypedSelector(selectLocale);
  const { direction } = LOCALE_FEATURES[locale];
  const words = useTypedSelector(selectProcessedWords);
  const error = useTypedSelector(selectVerifyError);
  const query = useTypedSelector(selectWordsQuery);
  const sort = useTypedSelector(selectWordsSort);
  const hoveredWord = useTypedSelector(selectHoveredWord);
  const highlightedIndex = hoveredWord ? words.findIndex((word) => isSameBoardWord(word, hoveredWord)) : -1;
  const highlightWord = useCallback(
    (word: VerifiedWord | null) => {
      const isClosing = !isOpen;

      if (!isClosing) {
        dispatch(word ? hoveredWordSlice.actions.set(word) : hoveredWordSlice.actions.clear());
      }
    },
    [dispatch, isOpen],
  );
  const pointerHighlight = usePointerHighlight(words, highlightWord);
  const rowProps = useMemo<WordRowData>(
    () => ({ highlightFollowsPointer, highlightedIndex, isTouchDevice, pointerHighlight, words, onPreview }),
    [highlightFollowsPointer, highlightedIndex, isTouchDevice, pointerHighlight, words, onPreview],
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

  useEffect(() => {
    if (isOpen && isCompactLayout && words.length > 0 && highlightedIndex === -1) {
      dispatch(hoveredWordSlice.actions.set(words[0]));
    }
  }, [dispatch, highlightedIndex, isOpen, isCompactLayout, words]);

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
        {error && <EmptyState variant="error">{error.message}</EmptyState>}

        {!error && words.length === 0 && (
          <EmptyState variant="info">{translate('words.empty-state.no-words')}</EmptyState>
        )}

        {words.length > 0 && (
          <ListContainer className={styles.listContainer}>
            <List
              className={styles.list}
              dir={direction}
              overscanCount={RESULTS_OVERSCAN_COUNT}
              rowComponent={WordRow}
              rowCount={words.length}
              rowHeight={RESULTS_ITEM_HEIGHT}
              rowProps={rowProps}
              onMouseLeave={highlightFollowsPointer ? pointerHighlight.onListMouseLeave : undefined}
            />
          </ListContainer>
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
