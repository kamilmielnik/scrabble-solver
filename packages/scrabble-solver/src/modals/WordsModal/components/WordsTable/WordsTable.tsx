import classNames from 'classnames';
import { type FunctionComponent, useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { List } from 'react-window';

import { HeaderButton, QueryInput } from '@/components/Table';
import tableStyles from '@/components/Table/Table.module.scss';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import { LOCALE_FEATURES } from '@/i18n/constants';
import GeoAlt from '@/icons/GeoAlt.svg';
import QuestionSquare from '@/icons/QuestionSquare.svg';
import { RESULTS_ITEM_HEIGHT, RESULTS_OVERSCAN_COUNT } from '@/parameters';
import {
  hoveredWordSlice,
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
  className?: string;
}

export const WordsTable: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const isTouchDevice = useIsTouchDevice();
  const locale = useTypedSelector(selectLocale);
  const { direction } = LOCALE_FEATURES[locale];
  const words = useTypedSelector(selectProcessedWords);
  const query = useTypedSelector(selectWordsQuery);
  const sort = useTypedSelector(selectWordsSort);
  const rowProps = useMemo<WordRowData>(() => ({ isTouchDevice, words }), [isTouchDevice, words]);

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
    return () => {
      dispatch(hoveredWordSlice.actions.clear());
    };
  }, [dispatch]);

  return (
    <div
      aria-label={translate('words')}
      className={classNames(styles.words, className)}
      data-testid="words"
      role="region"
    >
      <div className={tableStyles.header}>
        <HeaderButton
          className={styles.coordinates}
          Icon={GeoAlt}
          id={WordColumnId.Coordinates}
          sort={sort}
          translationKey="settings.showCoordinates"
          onSort={handleSort}
        />

        <HeaderButton
          className={styles.word}
          id={WordColumnId.Word}
          sort={sort}
          translationKey="common.word"
          onSort={handleSort}
        />

        <HeaderButton
          className={styles.stat}
          Icon={QuestionSquare}
          id={WordColumnId.Validity}
          sort={sort}
          translationKey="words.validity"
          onSort={handleSort}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.listContainer} onMouseLeave={handleMouseLeave}>
          <List
            className={styles.list}
            dir={direction}
            overscanCount={RESULTS_OVERSCAN_COUNT}
            rowComponent={WordRow}
            rowCount={words.length}
            rowHeight={RESULTS_ITEM_HEIGHT}
            rowProps={rowProps}
          />
        </div>
      </div>

      {words.length > 0 && (
        <QueryInput
          className={styles.input}
          placeholder={translate('words.input.placeholder')}
          query={query}
          onQueryChange={handleQueryChange}
        />
      )}
    </div>
  );
};
