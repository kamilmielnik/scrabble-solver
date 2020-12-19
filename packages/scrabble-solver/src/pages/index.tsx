import React, { useCallback, useEffect } from 'react';
import Fingerprint2 from 'fingerprintjs2';

import { SvgIcon } from 'components';
import { flagGb, flagPl, flagUs } from 'icons';

import styles from './index.module.scss';

const Index = () => {
  return (
    <div className={styles.app}>
      <SvgIcon icon={flagPl} />
      <SvgIcon icon={flagGb} />
      <SvgIcon icon={flagUs} />
    </div>
  );
};

export default Index;
