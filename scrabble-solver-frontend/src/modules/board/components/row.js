import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Cell from './cell';
import styles from './styles.scss';

const Row = ({ cells, className }) => (
  <div className={classNames(styles.row, className)}>
    {cells.map((cell, index) => (
      <Cell key={index} cell={cell} />
    ))}
  </div>
);

Row.propTypes = {
  cells: PropTypes.array.isRequired,
  className: PropTypes.string
};

export default Row;
