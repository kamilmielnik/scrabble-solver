import classNames from 'classnames';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTween } from 'react-use';

import Logo from '../Logo';

import styles from './Splash.module.scss';

const DEFAULT_SPLASH_DURATION = 1000;

interface Props {
  className?: string;
  forceShow?: boolean;
  splashDuration?: number;
}

const Splash: FunctionComponent<Props> = ({ className, forceShow, splashDuration = DEFAULT_SPLASH_DURATION }) => {
  const [isTimeoutFinished, setIsTimeoutFinished] = useState<boolean>(false);
  const hidden = isTimeoutFinished && !forceShow;
  const progress = useTween('inCubic', DEFAULT_SPLASH_DURATION);
  const progressPercent = `${(progress * 100).toFixed(2)}%`;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsTimeoutFinished(true);
    }, splashDuration);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [splashDuration]);

  return (
    <div
      className={classNames(styles.splash, className, {
        [styles.hidden]: hidden,
      })}
    >
      <div className={styles.content}>
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

        <div className={styles.author}>by Kamil Mielnik</div>
      </div>
    </div>
  );
};

export default Splash;
