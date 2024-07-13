import { FunctionComponent } from 'react';

import { useAppLayout, useColumns } from 'hooks';
import { RESULTS_COLUMN_WIDTH } from 'parameters';

import { GeoAlt, OneTwoThree, Square, SquareA, SquareB, Squares, Words } from 'icons';
import { ResultColumnId } from 'types';

import HeaderButton from './HeaderButton';
import styles from './Results.module.scss';

const Results: FunctionComponent = () => {
  const { resultWordWidth } = useAppLayout();
  const columns = useColumns();

  return (
    <div className={styles.header}>
      {columns.includes(ResultColumnId.Coordinates) && (
        <HeaderButton
          className={styles.coordinates}
          Icon={GeoAlt}
          id={ResultColumnId.Coordinates}
          translationKey="settings.showCoordinates"
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.Coordinates] }}
        />
      )}

      {columns.includes(ResultColumnId.Word) && (
        <HeaderButton
          className={styles.word}
          id={ResultColumnId.Word}
          translationKey="common.word"
          style={{ flexBasis: resultWordWidth }}
        />
      )}

      {columns.includes(ResultColumnId.TilesCount) && (
        <HeaderButton
          className={styles.stat}
          Icon={Squares}
          id={ResultColumnId.TilesCount}
          translationKey="common.tiles"
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.TilesCount] }}
        />
      )}

      {columns.includes(ResultColumnId.VowelsCount) && (
        <HeaderButton
          className={styles.stat}
          Icon={SquareA}
          id={ResultColumnId.VowelsCount}
          translationKey="common.vowels"
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.VowelsCount] }}
        />
      )}

      {columns.includes(ResultColumnId.ConsonantsCount) && (
        <HeaderButton
          className={styles.stat}
          Icon={SquareB}
          id={ResultColumnId.ConsonantsCount}
          translationKey="common.consonants"
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.ConsonantsCount] }}
        />
      )}

      {columns.includes(ResultColumnId.BlanksCount) && (
        <HeaderButton
          className={styles.stat}
          Icon={Square}
          id={ResultColumnId.BlanksCount}
          translationKey="common.blanks"
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.BlanksCount] }}
        />
      )}

      {columns.includes(ResultColumnId.WordsCount) && (
        <HeaderButton
          className={styles.stat}
          Icon={Words}
          id={ResultColumnId.WordsCount}
          translationKey="common.words"
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.WordsCount] }}
        />
      )}

      {columns.includes(ResultColumnId.Points) && (
        <HeaderButton
          className={styles.points}
          Icon={OneTwoThree}
          id={ResultColumnId.Points}
          translationKey="common.points"
          style={{ flexBasis: RESULTS_COLUMN_WIDTH[ResultColumnId.Points] }}
        />
      )}
    </div>
  );
};

export default Results;
