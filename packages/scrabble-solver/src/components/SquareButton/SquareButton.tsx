import classNames from 'classnames';
import React, { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler } from 'react';

import SvgIcon from '../SvgIcon';
import { useTooltip } from '../Tooltip';

import Link from './Link';
import styles from './SquareButton.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: never;
  icon: BrowserSpriteSymbol;
  tooltip: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const SquareButton: FunctionComponent<Props> = ({ className, icon, tooltip, ...props }) => {
  const triggerProps = useTooltip(tooltip, props);

  return (
    <button className={classNames(styles.squareButton, className)} type="button" {...triggerProps} {...props}>
      <span className={styles.content}>
        <SvgIcon className={styles.icon} icon={icon} />
      </span>
    </button>
  );
};

export default Object.assign(SquareButton, {
  Link,
});
