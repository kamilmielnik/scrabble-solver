import classNames from 'classnames';
import { AnimationEventHandler, FunctionComponent } from 'react';

import Logo from '../Logo';
import SplashScreen from '../SplashScreen';

import styles from './LogoSplashScreen.module.scss';

interface Props {
  className?: string;
  forceShow?: boolean;
  onAnimationEnd?: AnimationEventHandler<HTMLDivElement>;
}

const LogoSplashScreen: FunctionComponent<Props> = ({ className, forceShow, onAnimationEnd }) => (
  <SplashScreen
    className={classNames(styles.logoSplashScreen, className, {
      [styles.animated]: !forceShow,
    })}
    onAnimationEnd={onAnimationEnd}
  >
    <div className={styles.logos}>
      <Logo className={styles.logoGrayscale} />
      <Logo className={styles.logoColor} />
    </div>

    <h1 className={styles.author}>by Kamil Mielnik</h1>
  </SplashScreen>
);

export default LogoSplashScreen;
