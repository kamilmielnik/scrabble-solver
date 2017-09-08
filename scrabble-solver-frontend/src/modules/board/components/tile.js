import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const Tile = ({ className, tile: { character, isBlank }, ...props }) => (
  <div
    className={classNames(
      styles.tile,
      {
        [styles.blank]: isBlank
      },
      className
    )}>
    <input
      className={styles.character}
      maxLength={1}
      value={character}
      {...props} />
  </div>
);

Tile.propTypes = {
  className: PropTypes.string,
  tile: PropTypes.shape({
    character: PropTypes.string,
    isBlank: PropTypes.bool
  }).isRequired
};

export default Tile;
