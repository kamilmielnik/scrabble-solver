import classNames from 'classnames';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTween } from 'react-use';

import Logo from '../Logo';
import Screen from '../Screen';

import styles from './Splash.module.scss';

interface Props {
  className?: string;
  duration: number;
  forceShow?: boolean;
}

const Splash: FunctionComponent<Props> = ({ className, duration, forceShow }) => {
  const [isTimeoutFinished, setIsTimeoutFinished] = useState<boolean>(false);
  const hidden = isTimeoutFinished && !forceShow;

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
      <div
        className={classNames(styles.logos, {
          [styles.pulsating]: isTimeoutFinished,
        })}
      >
        <Logo className={styles.logoGrayscale} />
        <Logo className={styles.logoColor} />
      </div>

      <h1 className={styles.author}>by Kamil Mielnik</h1>
    </Screen>
  );
};

export default Splash;
