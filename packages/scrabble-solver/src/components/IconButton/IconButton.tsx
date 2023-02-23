import classNames from 'classnames';
import { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler, SVGAttributes } from 'react';

import { useTooltip } from '../Tooltip';

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
  const triggerProps = useTooltip(tooltip, props);

  return (
    <button className={classNames(styles.iconButton, className)} type="button" {...props} {...triggerProps}>
      <span className={styles.content}>
        <Icon className={styles.icon} />
      </span>
    </button>
  );
};

export default Object.assign(IconButton, {
  Link,
});
