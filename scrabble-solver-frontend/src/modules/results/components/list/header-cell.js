import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { changeSortedColumn } from 'results/state';
import { selectSortedColumnName, selectSortingDirection } from 'results/selectors';
import IconSort from 'components/icons/sort';
import styles from './styles.scss';

const HeaderCell = ({ dataKey, label, sortedColumnName, sortingDirection, onSort }) => (
  <div className={styles.headerCellContent} onClick={onSort}>
    <div>
      <FormattedMessage id={label} />
    </div>

    {dataKey === sortedColumnName && (
      <IconSort className={styles.iconSort} sortingDirection={sortingDirection} />
    )}
  </div>
);

HeaderCell.propTypes = {
  dataKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  sortedColumnName: PropTypes.string,
  sortingDirection: PropTypes.oneOf([ 'ascending', 'descending' ]),
  onSort: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  sortedColumnName: selectSortedColumnName(state),
  sortingDirection: selectSortingDirection(state)
});

const mapDispatchToProps = (dispatch, { dataKey }) => ({
  onSort: () => dispatch(changeSortedColumn(dataKey))
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderCell);
