import classNames from 'classnames';
import { AnchorHTMLAttributes, FunctionComponent, SVGAttributes } from 'react';

import { useTooltip } from '../Tooltip';

import styles from './SquareButton.module.scss';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: never;
  href: string;
  Icon: FunctionComponent<SVGAttributes<SVGElement>>;
  tooltip: string;
}

const Link: FunctionComponent<Props> = ({ className, Icon, tooltip, ...props }) => {
  const triggerProps = useTooltip(tooltip, props);

  return (
    <a className={classNames(styles.squareButton, className)} type="button" {...props} {...triggerProps}>
      <span className={styles.content}>
        <Icon className={styles.icon} />
      </span>
    </a>
  );
};

export default Link;
