import classNames from 'classnames';
import { AnimationEventHandler, FunctionComponent } from 'react';

import Logo from '../Logo';
import Screen from '../Screen';

import styles from './Splash.module.scss';

interface Props {
  className?: string;
  forceShow?: boolean;
  onAnimationEnd?: AnimationEventHandler<HTMLDivElement>;
}

const Splash: FunctionComponent<Props> = ({ className, forceShow, onAnimationEnd }) => (
  <Screen
    className={classNames(styles.splash, className, {
      [styles.animated]: !forceShow,
    })}
    onAnimationEnd={onAnimationEnd}
  >
    <div className={styles.logos}>
      <Logo className={styles.logoGrayscale} />
      <Logo className={styles.logoColor} />
    </div>

    <h1 className={styles.author}>by Kamil Mielnik</h1>
  </Screen>
);

export default Splash;
