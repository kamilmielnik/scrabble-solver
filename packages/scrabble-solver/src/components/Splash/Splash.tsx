import classNames from 'classnames';
import React, { FunctionComponent, useEffect, useState } from 'react';

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
      <div>
        <Logo className={styles.logo} />

        <div className={styles.author}>by Kamil Mielnik</div>
      </div>
    </div>
  );
};

export default Splash;
