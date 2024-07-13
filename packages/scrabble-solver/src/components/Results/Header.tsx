import { FunctionComponent } from 'react';

import { useAppLayout, useColumns } from 'hooks';
import { GeoAlt, OneTwoThree, Square, SquareA, SquareB, Squares, Words } from 'icons';
import { RESULTS_COLUMN_WIDTH } from 'parameters';
import { ResultColumnId } from 'types';

import HeaderButton from './HeaderButton';
import styles from './Results.module.scss';

const Results: FunctionComponent = () => {
  const { resultWordWidth } = useAppLayout();
  const columns = useColumns();

  return (
    <div className={styles.header}>
      {columns[ResultColumnId.Coordinates] && (
        <HeaderButton
          className={styles.coordinates}
          Icon={GeoAlt}
          id={ResultColumnId.Coordinates}
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.Coordinates] }}
          translationKey="settings.showCoordinates"
        />
      )}

      {columns[ResultColumnId.Word] && (
        <HeaderButton
          className={styles.word}
          id={ResultColumnId.Word}
          style={{ flexBasis: resultWordWidth }}
          translationKey="common.word"
        />
      )}

      {columns[ResultColumnId.TilesCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={Squares}
          id={ResultColumnId.TilesCount}
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.TilesCount] }}
          translationKey="common.tiles"
        />
      )}

      {columns[ResultColumnId.VowelsCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={SquareA}
          id={ResultColumnId.VowelsCount}
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.VowelsCount] }}
          translationKey="common.vowels"
        />
      )}

      {columns[ResultColumnId.ConsonantsCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={SquareB}
          id={ResultColumnId.ConsonantsCount}
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.ConsonantsCount] }}
          translationKey="common.consonants"
        />
      )}

      {columns[ResultColumnId.BlanksCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={Square}
          id={ResultColumnId.BlanksCount}
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.BlanksCount] }}
          translationKey="common.blanks"
        />
      )}

      {columns[ResultColumnId.WordsCount] && (
        <HeaderButton
          className={styles.stat}
          Icon={Words}
          id={ResultColumnId.WordsCount}
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.WordsCount] }}
          translationKey="common.words"
        />
      )}

      {columns[ResultColumnId.Points] && (
        <HeaderButton
          className={styles.points}
          Icon={OneTwoThree}
          id={ResultColumnId.Points}
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.Points] }}
          translationKey="common.points"
        />
      )}
    </div>
  );
};

export default Results;
