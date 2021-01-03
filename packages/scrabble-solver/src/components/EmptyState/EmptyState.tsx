import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { useTranslation } from 'state';

import PlainTiles from '../PlainTiles';

import styles from './EmptyState.module.scss';

interface Props {
  className?: string;
  tiles?: string[][];
  type: 'error' | 'info' | 'success' | 'warning';
}

// TODO: import these from somewhere
const COLOR_BLUE = '#c7d8f9';
const COLOR_GREEN = '#bae3ba';
const COLOR_RED = '#f7c2aa';
const COLOR_YELLOW = '#efe3ae';

const COLORS_PER_TYPE: Record<Props['type'], string> = {
  error: COLOR_RED,
  info: COLOR_BLUE,
  success: COLOR_GREEN,
  warning: COLOR_YELLOW,
};

const EmptyState: FunctionComponent<Props> = ({ className, children, type }) => {
  const errorTranslation = useTranslation('empty-state.error');
  const infoTranslation = useTranslation('empty-state.info');
  const successTranslation = useTranslation('empty-state.success');
  const warningTranslation = useTranslation('empty-state.warning');

  const TILES_PER_TYPE: Record<Props['type'], string[][]> = {
    error: [[errorTranslation.toUpperCase()]],
    info: [[infoTranslation.toUpperCase()]],
    success: [[successTranslation.toUpperCase()]],
    warning: [[warningTranslation.toUpperCase()]],
  };

  return (
    <div className={classNames(styles.emptyState, className)}>
      <PlainTiles className={styles.tiles} color={COLORS_PER_TYPE[type]} content={TILES_PER_TYPE[type]} />

      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default EmptyState;
