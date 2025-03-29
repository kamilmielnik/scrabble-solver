import classNames from 'classnames';
import { type CSSProperties, type FunctionComponent, type ReactElement, type SVGAttributes, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { SortDown, SortUp } from 'icons';
import { resultsSlice, selectResultsSort, useTranslate, useTypedSelector } from 'state';
import { type ResultColumnId, SortDirection, type TranslationKey } from 'types';

import { Tooltip } from '../Tooltip';

import styles from './Results.module.scss';

interface Props {
  className: string;
  Icon?: FunctionComponent<SVGAttributes<SVGElement>>;
  id: ResultColumnId;
  translationKey: TranslationKey;
  style?: CSSProperties;
}

export const HeaderButton = ({ className, Icon, id, translationKey, style }: Props): ReactElement => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const sort = useTypedSelector(selectResultsSort);

  const handleClick = useCallback(() => {
    dispatch(resultsSlice.actions.sort(id));
  }, [dispatch, id]);

  return (
    <Tooltip tooltip={translate(translationKey)}>
      <button
        aria-label={translate(translationKey)}
        className={classNames(styles.headerButton, className)}
        style={style}
        type="button"
        onClick={handleClick}
      >
        <span className={styles.cell}>
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
