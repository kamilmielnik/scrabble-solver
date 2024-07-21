import classNames from 'classnames';
import { AnchorHTMLAttributes, FunctionComponent, SVGAttributes } from 'react';

import { Tooltip } from '../Tooltip';

import styles from './IconButton.module.scss';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  'aria-label': string;
  children?: never;
  href: string;
  Icon: FunctionComponent<SVGAttributes<SVGElement>>;
  tooltip: string;
}

const Link: FunctionComponent<Props> = ({ className, Icon, tooltip, ...props }) => {
  return (
    <Tooltip tooltip={tooltip}>
      <a className={classNames(styles.iconButton, className)} {...props}>
        <span className={styles.content}>
          <Icon aria-hidden="true" className={styles.icon} role="img" />
        </span>
      </a>
    </Tooltip>
  );
};

export default Link;
