import classNames from 'classnames';
import { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler, SVGAttributes } from 'react';

import { Tooltip } from '../Tooltip';

import styles from './IconButton.module.scss';
import Link from './Link';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  children?: never;
  Icon: FunctionComponent<SVGAttributes<SVGElement>>;
  tooltip: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const IconButton: FunctionComponent<Props> = ({ className, Icon, tooltip, ...props }) => {
  return (
    <Tooltip tooltip={tooltip}>
      <button className={classNames(styles.iconButton, className)} type="button" {...props}>
        <span className={styles.content}>
          <Icon aria-hidden="true" className={styles.icon} role="img" />
        </span>
      </button>
    </Tooltip>
  );
};

export default Object.assign(IconButton, {
  Link,
});
