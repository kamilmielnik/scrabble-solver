import classNames from 'classnames';
import { type ReactNode } from 'react';

import styles from './Table.module.scss';

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Draws the focus ring of a keyboard-focused row outside the scrolling list, which would clip it.
 */
export function ListContainer({ children, className }: Props) {
  return (
    <div className={classNames(styles.listContainer, className)}>
      {children}

      <div className={styles.focusRing} data-testid="row-focus-ring" />
    </div>
  );
}
