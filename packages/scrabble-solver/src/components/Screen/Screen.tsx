import classNames from 'classnames';
import React, { AnimationEventHandler, FunctionComponent, ReactNode } from 'react';

import styles from './Screen.module.scss';

interface Props {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  onAnimationEnd?: AnimationEventHandler<HTMLDivElement>;
}

const Screen: FunctionComponent<Props> = ({ children, className, contentClassName, onAnimationEnd }) => (
  <div className={classNames(styles.screen, className)} onAnimationEnd={onAnimationEnd}>
    <div className={classNames(styles.content, contentClassName)}>{children}</div>
  </div>
);

export default Screen;
