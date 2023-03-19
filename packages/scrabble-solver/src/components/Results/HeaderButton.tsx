import classNames from 'classnames';
import { ReactElement, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { SortDown, SortUp } from 'icons';
import { resultsSlice, selectResultsSort, useTranslate, useTypedSelector } from 'state';
import { SortDirection } from 'types';

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

  const handleClick = useCallback(() => {
    dispatch(resultsSlice.actions.sort(column.id));
  }, [column.id, dispatch]);

  return (
    <button
      aria-label={translate(column.translationKey)}
      className={classNames(styles.headerButton, column.className)}
      key={column.id}
      type="button"
      onClick={handleClick}
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
