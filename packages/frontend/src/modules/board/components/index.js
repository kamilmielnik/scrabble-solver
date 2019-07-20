import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectRowsWithCandidate } from 'board/selectors';

import Row from './row';
import styles from './board.module.scss';

const Board = ({ rows }) => (
  <div className={styles.board}>
    {rows.map((cells, index) => (
      <Row key={index} cells={cells} />
    ))}
  </div>
);

Board.propTypes = {
  rows: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  rows: selectRowsWithCandidate(state)
});

export default connect(mapStateToProps)(Board);
