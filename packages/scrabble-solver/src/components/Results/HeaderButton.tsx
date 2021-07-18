import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';

import { sortDown, sortUp } from 'icons';
import {
  resultsSlice,
  selectResultsSortColumn,
  selectResultsSortDirection,
  useTranslate,
  useTypedSelector,
} from 'state';
import { ResultColumn, SortDirection } from 'types';

import SvgIcon from '../SvgIcon';
import Tooltip from '../Tooltip';

import styles from './Results.module.scss';
import { Column } from './types';

interface Props {
  column: Column;
}

const HeaderButton = ({ column }: Props): ReactElement => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const sortColumn = useTypedSelector(selectResultsSortColumn);
  const sortDirection = useTypedSelector(selectResultsSortDirection);

  const handleOrderChange = (columnId: ResultColumn) => {
    dispatch(resultsSlice.actions.sort(columnId));
  };

  return (
    <Tooltip tooltip={translate(column.translationKey)}>
      {({ ariaAttributes, setReferenceElement, onHide, onShow }) => (
        <button
          {...ariaAttributes}
          className={classNames(styles.headerButton, column.className)}
          key={column.id}
          ref={setReferenceElement}
          type="button"
          onBlur={onHide}
          onClick={() => handleOrderChange(column.id)}
          onFocus={onShow}
          onMouseOut={onHide}
          onMouseOver={onShow}
        >
          <span className={styles.cell}>
            <span className={styles.headerButtonLabel}>{translate(column.translationKey)}</span>

            {sortColumn === column.id && (
              <SvgIcon
                className={styles.sortIcon}
                icon={sortDirection === SortDirection.Ascending ? sortUp : sortDown}
              />
            )}
          </span>
        </button>
      )}
    </Tooltip>
  );
};

export default HeaderButton;
