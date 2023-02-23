import classNames from 'classnames';
import { AnchorHTMLAttributes, FunctionComponent, SVGAttributes } from 'react';

import { useTooltip } from '../Tooltip';

import styles from './IconButton.module.scss';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  'aria-label': string;
  children?: never;
  href: string;
  Icon: FunctionComponent<SVGAttributes<SVGElement>>;
  tooltip: string;
}

const Link: FunctionComponent<Props> = ({ className, Icon, tooltip, ...props }) => {
  const triggerProps = useTooltip(tooltip, props);

  return (
    <a className={classNames(styles.iconButton, className)} {...props} {...triggerProps}>
      <span className={styles.content}>
        <Icon className={styles.icon} />
      </span>
    </a>
  );
};

export default Link;
