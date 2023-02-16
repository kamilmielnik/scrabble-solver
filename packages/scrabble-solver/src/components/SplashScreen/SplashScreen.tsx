import classNames from 'classnames';
import { AnimationEventHandler, FunctionComponent, ReactNode } from 'react';

import styles from './SplashScreen.module.scss';

interface Props {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  onAnimationEnd?: AnimationEventHandler<HTMLDivElement>;
}

const SplashScreen: FunctionComponent<Props> = ({ children, className, contentClassName, onAnimationEnd }) => (
  <div className={classNames(styles.splashScreen, className)} onAnimationEnd={onAnimationEnd}>
    <div className={classNames(styles.content, contentClassName)}>{children}</div>
  </div>
);

export default SplashScreen;
