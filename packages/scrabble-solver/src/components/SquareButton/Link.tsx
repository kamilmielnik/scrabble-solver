import classNames from 'classnames';
import React, { AnchorHTMLAttributes, FunctionComponent } from 'react';

import SvgIcon from '../SvgIcon';
import { useTooltip } from '../Tooltip';

import styles from './SquareButton.module.scss';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: never;
  icon: BrowserSpriteSymbol;
  href: string;
  tooltip: string;
}

const Link: FunctionComponent<Props> = ({ className, icon, tooltip, ...props }) => {
  const triggerProps = useTooltip(tooltip, props);

  return (
    <a className={classNames(styles.squareButton, className)} type="button" {...triggerProps} {...props}>
      <span className={styles.content}>
        <SvgIcon className={styles.icon} icon={icon} />
      </span>
    </a>
  );
};

export default Link;
