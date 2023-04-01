/* eslint-disable max-len */

import classNames from 'classnames';
import { CSSProperties, FunctionComponent } from 'react';

import styles from './ProductHuntBadge.module.scss';

interface Props {
  className?: string;
  style?: CSSProperties;
}

const ProductHuntBadge: FunctionComponent<Props> = ({ className, style }) => (
  <a
    className={classNames(styles.productHuntBadge, className)}
    href="https://www.producthunt.com/posts/scrabble-solver?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-scrabble&#0045;solver"
    rel="noreferrer"
    style={style}
    target="_blank"
  >
    <img
      alt="Scrabble&#0032;Solver - Free&#0032;and&#0032;open&#0045;source&#0032;analysis&#0032;tool&#0032;for&#0032;Scrabble&#0032;&#0038;&#0032;Literaki | Product Hunt"
      height="54"
      src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=387002&theme=dark"
      style={{ width: 250, height: 54 }}
      width="250"
    />
  </a>
);

export default ProductHuntBadge;
