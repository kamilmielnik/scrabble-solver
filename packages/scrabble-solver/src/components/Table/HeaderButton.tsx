import classNames from 'classnames';
import { type FunctionComponent, type ReactElement, type SVGAttributes, useCallback } from 'react';

import SortDown from '@/icons/SortDown.svg';
import SortUp from '@/icons/SortUp.svg';
import { useTranslate } from '@/state';
import { type Sort, SortDirection, type TranslationKey } from '@/types';

import { Tooltip } from '../Tooltip';

import styles from './Table.module.scss';

interface Props<Id extends string> {
  className?: string;
  Icon?: FunctionComponent<SVGAttributes<SVGElement>>;
  id: Id;
  primary?: boolean;
  sort: Sort<Id>;
  translationKey: TranslationKey;
  onSort: (id: Id) => void;
}

export const HeaderButton = <Id extends string>({
  className,
  Icon,
  id,
  primary,
  sort,
  translationKey,
  onSort,
}: Props<Id>): ReactElement => {
  const translate = useTranslate();

  const handleClick = useCallback(() => {
    onSort(id);
  }, [id, onSort]);

  return (
    <Tooltip tooltip={translate(translationKey)}>
      <button
        aria-label={translate(translationKey)}
        className={classNames(styles.headerButton, className)}
        type="button"
        onClick={handleClick}
      >
        <span className={classNames(styles.cell, { [styles.primary]: primary })}>
          {Icon && <Icon aria-hidden="true" className={styles.headerButtonIcon} role="img" />}

          {!Icon && <span className={styles.headerButtonLabel}>{translate(translationKey)}</span>}

          {sort.column === id && (
            <>
              {sort.direction === SortDirection.Ascending && <SortUp className={styles.sortIcon} />}
              {sort.direction === SortDirection.Descending && <SortDown className={styles.sortIcon} />}
            </>
          )}
        </span>
      </button>
    </Tooltip>
  );
};
