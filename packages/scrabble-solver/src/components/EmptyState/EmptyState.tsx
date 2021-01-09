import classNames from 'classnames';
import React, { FunctionComponent, useMemo } from 'react';

import { useTranslate } from 'state';

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

const TITLE_KEY_PER_TYPE: Record<Props['type'], string> = {
  error: 'empty-state.error',
  info: 'empty-state.info',
  success: 'empty-state.success',
  warning: 'empty-state.warning',
};

const COLORS_PER_TYPE: Record<Props['type'], string> = {
  error: COLOR_RED,
  info: COLOR_BLUE,
  success: COLOR_GREEN,
  warning: COLOR_YELLOW,
};

const EmptyState: FunctionComponent<Props> = ({ className, children, type }) => {
  const translate = useTranslate();
  const title = useMemo(() => translate(TITLE_KEY_PER_TYPE[type]), [translate]);
  const content = useMemo(() => [[title.toUpperCase()]], [title]);

  return (
    <div className={classNames(styles.emptyState, className)}>
      <PlainTiles className={styles.tiles} color={COLORS_PER_TYPE[type]} content={content} />

      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default EmptyState;
