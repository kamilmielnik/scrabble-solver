import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { selectRowsWithCandidate } from 'board/selectors';
import Row from './row';
import styles from './styles.scss';

const Board = ({ className, rows }) => (
  <div className={classNames(styles.board, className)}>
    {rows.map((cells, index) => (
      <Row key={index} cells={cells} />
    ))}
  </div>
);

Board.propTypes = {
  className: PropTypes.string,
  rows: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  rows: selectRowsWithCandidate(state)
});

export default connect(mapStateToProps)(Board);
