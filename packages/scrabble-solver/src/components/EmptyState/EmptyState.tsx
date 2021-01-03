import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import PlainTiles from '../PlainTiles';

import styles from './EmptyState.module.scss';

interface Props {
  className?: string;
  tiles?: string[][];
  type: 'info' | 'error';
}

// TODO: import these from somewhere
// const COLOR_YELLOW = '#efe3ae';
// const COLOR_GREEN = '#bae3ba';
const COLOR_BLUE = '#c7d8f9';
const COLOR_RED = '#f7c2aa';

const COLORS_PER_TYPE: Record<Props['type'], string> = {
  info: COLOR_BLUE,
  error: COLOR_RED,
};

const TILES_PER_TYPE: Record<Props['type'], string[][]> = {
  info: [['INFO']],
  error: [['ERROR']],
};

const EmptyState: FunctionComponent<Props> = ({ className, children, type }) => (
  <div className={classNames(styles.emptyState, className)}>
    <PlainTiles className={styles.tiles} color={COLORS_PER_TYPE[type]} content={TILES_PER_TYPE[type]} />

    <div className={styles.content}>{children}</div>
  </div>
);

export default EmptyState;
