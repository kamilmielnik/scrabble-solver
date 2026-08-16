import { type FunctionComponent } from 'react';

import { useColumns } from '@/hooks/useColumns';
import GeoAlt from '@/icons/GeoAlt.svg';
import OneTwoThree from '@/icons/OneTwoThree.svg';
import Square from '@/icons/Square.svg';
import SquareA from '@/icons/SquareA.svg';
import SquareB from '@/icons/SquareB.svg';
import Squares from '@/icons/Squares.svg';
import Words from '@/icons/Words.svg';
import { ResultColumnId } from '@/types';

import { HeaderButton } from './HeaderButton';
import styles from './Results.module.scss';

export const Header: FunctionComponent = () => {
  const columns = useColumns();

  return (
    <div className={styles.header}>
      {columns[ResultColumnId.Coordinates] && (
        <HeaderButton
          className={styles.coordinates}
          Icon={GeoAlt}
          id={ResultColumnId.Coordinates}
          translationKey="settings.showCoordinates"
        />
      )}

      {columns[ResultColumnId.Word] && (
        <HeaderButton className={styles.word} id={ResultColumnId.Word} translationKey="common.word" />
      )}

      {columns[ResultColumnId.TilesCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={Squares}
          id={ResultColumnId.TilesCount}
          translationKey="common.tiles"
        />
      )}

      {columns[ResultColumnId.VowelsCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={SquareA}
          id={ResultColumnId.VowelsCount}
          translationKey="common.vowels"
        />
      )}

      {columns[ResultColumnId.ConsonantsCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={SquareB}
          id={ResultColumnId.ConsonantsCount}
          translationKey="common.consonants"
        />
      )}

      {columns[ResultColumnId.BlanksCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={Square}
          id={ResultColumnId.BlanksCount}
          translationKey="common.blanks"
        />
      )}

      {columns[ResultColumnId.WordsCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={Words}
          id={ResultColumnId.WordsCount}
          translationKey="common.words"
        />
      )}

      {columns[ResultColumnId.Points] && (
        <HeaderButton
          className={styles.points}
          Icon={OneTwoThree}
          id={ResultColumnId.Points}
          translationKey="common.points"
        />
      )}
    </div>
  );
};
