import classNames from 'classnames';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTween } from 'react-use';

import Logo from '../Logo';
import Screen from '../Screen';

import styles from './Splash.module.scss';

const COMPLETE_SPLASH_DURATION_PERCENT = 0.15;

interface Props {
  className?: string;
  duration: number;
  forceShow?: boolean;
}

const Splash: FunctionComponent<Props> = ({ className, duration, forceShow }) => {
  const [isTimeoutFinished, setIsTimeoutFinished] = useState<boolean>(false);
  const hidden = isTimeoutFinished && !forceShow;
  const progress = useTween('inCubic', (1 - COMPLETE_SPLASH_DURATION_PERCENT) * duration);
  const progressPercent = `${(progress * 100).toFixed(2)}%`;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsTimeoutFinished(true);
    }, duration);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [duration]);

  return (
    <Screen className={classNames(styles.splash, className)} hidden={hidden}>
      <Logo
        className={classNames(styles.logo, styles.logoGrayscale, {
          [styles.pulsating]: isTimeoutFinished,
        })}
      />

      <Logo
        className={classNames(styles.logo, styles.logoColor, {
          [styles.pulsating]: isTimeoutFinished,
        })}
        style={{ clipPath: `polygon(0% 0%, ${progressPercent} 0, ${progressPercent} 100%, 0% 100%)` }}
      />

      <h1 className={styles.author}>by Kamil Mielnik</h1>
    </Screen>
  );
};

export default Splash;
