import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import Screen from '../Screen';

import styles from './Settings.module.scss';

interface Props {
  className?: string;
  hidden?: boolean;
}

const Settings: FunctionComponent<Props> = ({ className, hidden }) => (
  <Screen className={classNames(styles.settings, className)} hidden={hidden}>
    Settings
  </Screen>
);

export default Settings;
