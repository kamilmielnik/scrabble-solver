import Link from 'next/link';
import { FunctionComponent } from 'react';

import { DashCircleFill } from 'icons';

import PlainTiles from '../PlainTiles';

import styles from './NotFound.module.scss';

const CONTENT = [['HTTP', '404']];

const NotFound: FunctionComponent = () => (
  <div className={styles.notFound}>
    <Link href="/">
      <a className={styles.link}>
        <DashCircleFill className={styles.icon} />
        <PlainTiles className={styles.tiles} content={CONTENT} />
      </a>
    </Link>
  </div>
);

export default NotFound;
