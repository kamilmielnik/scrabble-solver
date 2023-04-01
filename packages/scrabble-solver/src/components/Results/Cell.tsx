import classNames from 'classnames';
import { FunctionComponent, ReactNode } from 'react';

import { selectLocale, useTranslate, useTypedSelector } from 'state';
import { TranslationKey } from 'types';

import { useTooltip } from '../Tooltip';

import styles from './Results.module.scss';

interface Props {
  children?: ReactNode;
  className?: string;
  translationKey: TranslationKey;
  tooltip?: string | number;
  value: string | number;
}

const Cell: FunctionComponent<Props> = ({ children, className, translationKey, tooltip, value }) => {
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const formattedValue = value.toLocaleString(locale);
  const triggerProps = useTooltip(`${translate(translationKey)}: ${tooltip || formattedValue}`);

  return (
    <div className={classNames(styles.cell, className)} {...triggerProps}>
      {children || formattedValue}
    </div>
  );
};

export default Cell;
