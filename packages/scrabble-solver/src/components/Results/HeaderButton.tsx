import classNames from 'classnames';
import { ReactElement } from 'react';
import { useDispatch } from 'react-redux';

import { SortDown, SortUp } from 'icons';
import { resultsSlice, selectResultsSort, useTranslate, useTypedSelector } from 'state';
import { ResultColumn, SortDirection } from 'types';

import { useTooltip } from '../Tooltip';

import styles from './Results.module.scss';
import { Column } from './types';

interface Props {
  column: Column;
}

const HeaderButton = ({ column }: Props): ReactElement => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const sort = useTypedSelector(selectResultsSort);
  const triggerProps = useTooltip(translate(column.translationKey));

  const handleOrderChange = (columnId: ResultColumn) => {
    dispatch(resultsSlice.actions.sort(columnId));
  };

  return (
    <button
      aria-label={translate(column.translationKey)}
      className={classNames(styles.headerButton, column.className)}
      key={column.id}
      type="button"
      onClick={() => handleOrderChange(column.id)}
      {...triggerProps}
    >
      <span className={styles.cell}>
        <span className={styles.headerButtonLabel}>{translate(column.translationKey)}</span>

        {sort.column === column.id && (
          <>
            {sort.direction === SortDirection.Ascending && <SortUp className={styles.sortIcon} />}
            {sort.direction === SortDirection.Descending && <SortDown className={styles.sortIcon} />}
          </>
        )}
      </span>
    </button>
  );
};

export default HeaderButton;
