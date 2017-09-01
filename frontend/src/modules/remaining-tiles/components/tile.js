import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getTileClassNames } from './tile-classnames';
import styles from './styles.scss';

const Tile = ({ character, count, points, usedCount }) => (
  <div
    key={character}
    className={classNames(
      styles.tile,
      getTileClassNames({ count, points, usedCount }),
      {
        [styles.error]: usedCount > count,
        [styles.noMoreLeft]: usedCount === count
      }
    )}>
    <div className={styles.character}>
      {`${character.toUpperCase()}`}
    </div>
    <div>
      {`${count - usedCount}/${count}`}
    </div>
  </div>
);

Tile.propTypes = {
  character: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  usedCount: PropTypes.number.isRequired
};

export default Tile;
