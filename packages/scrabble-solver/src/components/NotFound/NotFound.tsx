import Link from 'next/link';
import React, { FunctionComponent } from 'react';

import { dashCircleFill } from 'icons';

import PlainTiles from '../PlainTiles';
import SvgIcon from '../SvgIcon';

import styles from './NotFound.module.scss';

const CONTENT = [['HTTP', '404']];

const NotFound: FunctionComponent = () => (
  <div className={styles.notFound}>
    <Link href="/">
      <a className={styles.link}>
        <SvgIcon className={styles.icon} icon={dashCircleFill} />
        <PlainTiles className={styles.tiles} content={CONTENT} />
      </a>
    </Link>
  </div>
);

export default NotFound;
