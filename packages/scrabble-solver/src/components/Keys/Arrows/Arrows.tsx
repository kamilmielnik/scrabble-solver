import classNames from 'classnames';
import { type FunctionComponent } from 'react';

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'icons';

import { Key } from '../../Key';

import styles from './Arrows.module.scss';

interface Props {
  className?: string;
}

export const Arrows: FunctionComponent<Props> = ({ className }) => (
  <div className={classNames(styles.arrows, className)}>
    <Key className={classNames(styles.arrow, styles.left)}>
      <ArrowLeft aria-hidden="true" role="img" />
    </Key>
    <Key className={classNames(styles.arrow, styles.up)}>
      <ArrowUp aria-hidden="true" role="img" />
    </Key>
    <Key className={classNames(styles.arrow, styles.right)}>
      <ArrowRight aria-hidden="true" role="img" />
    </Key>
    <Key className={classNames(styles.arrow, styles.down)}>
      <ArrowDown aria-hidden="true" role="img" />
    </Key>
  </div>
);
