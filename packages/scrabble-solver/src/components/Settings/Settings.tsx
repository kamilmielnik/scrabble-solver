import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import styles from './Settings.module.scss';

interface Props {
  className?: string;
}

const Settings: FunctionComponent<Props> = ({ className }) => (
  <div className={classNames(styles.settings, className)}>

  </div>
);

export default Settings;
