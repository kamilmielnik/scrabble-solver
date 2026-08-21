import { type FunctionComponent, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Header as TableHeader, HeaderButton } from '@/components/Table';
import { useColumns } from '@/hooks/useColumns';
import GeoAlt from '@/icons/GeoAlt.svg';
import OneTwoThree from '@/icons/OneTwoThree.svg';
import Square from '@/icons/Square.svg';
import SquareA from '@/icons/SquareA.svg';
import SquareB from '@/icons/SquareB.svg';
import Squares from '@/icons/Squares.svg';
import Words from '@/icons/Words.svg';
import { resultsSlice, selectResultsSort, useTypedSelector } from '@/state';
import { ResultColumnId } from '@/types';

import styles from './Results.module.scss';

export const Header: FunctionComponent = () => {
  const dispatch = useDispatch();
  const columns = useColumns();
  const sort = useTypedSelector(selectResultsSort);

  const handleSort = useCallback(
    (columnId: ResultColumnId) => {
      dispatch(resultsSlice.actions.sort(columnId));
    },
    [dispatch],
  );

  return (
    <TableHeader>
      {columns[ResultColumnId.Coordinates] && (
        <HeaderButton
          className={styles.coordinates}
          Icon={GeoAlt}
          id={ResultColumnId.Coordinates}
          sort={sort}
          translationKey="settings.showCoordinates"
          onSort={handleSort}
        />
      )}

      {columns[ResultColumnId.Word] && (
        <HeaderButton
          className={styles.word}
          id={ResultColumnId.Word}
          sort={sort}
          translationKey="common.word"
          onSort={handleSort}
        />
      )}

      {columns[ResultColumnId.TilesCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={Squares}
          id={ResultColumnId.TilesCount}
          sort={sort}
          translationKey="common.tiles"
          onSort={handleSort}
        />
      )}

      {columns[ResultColumnId.VowelsCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={SquareA}
          id={ResultColumnId.VowelsCount}
          sort={sort}
          translationKey="common.vowels"
          onSort={handleSort}
        />
      )}

      {columns[ResultColumnId.ConsonantsCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={SquareB}
          id={ResultColumnId.ConsonantsCount}
          sort={sort}
          translationKey="common.consonants"
          onSort={handleSort}
        />
      )}

      {columns[ResultColumnId.BlanksCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={Square}
          id={ResultColumnId.BlanksCount}
          sort={sort}
          translationKey="common.blanks"
          onSort={handleSort}
        />
      )}

      {columns[ResultColumnId.WordsCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={Words}
          id={ResultColumnId.WordsCount}
          sort={sort}
          translationKey="common.words"
          onSort={handleSort}
        />
      )}

      {columns[ResultColumnId.Points] && (
        <HeaderButton
          className={styles.points}
          Icon={OneTwoThree}
          id={ResultColumnId.Points}
          sort={sort}
          translationKey="common.points"
          onSort={handleSort}
        />
      )}
    </TableHeader>
  );
};
