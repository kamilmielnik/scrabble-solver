import classNames from 'classnames';
import { type FunctionComponent, type ReactNode } from 'react';

import { selectLocale, useTranslate, useTypedSelector } from '@/state';
import { type TranslationKey } from '@/types';

import { Tooltip } from '../Tooltip';

import styles from './Table.module.scss';

interface Props {
  children?: ReactNode;
  className?: string;
  'data-testid'?: string;
  start?: boolean;
  translationKey?: TranslationKey;
  tooltip?: string | number;
  value: string | number;
}

export const Cell: FunctionComponent<Props> = ({
  children,
  className,
  'data-testid': dataTestId,
  start,
  translationKey,
  tooltip,
  value,
}) => {
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const formattedValue = value.toLocaleString(locale);
  const label = translationKey ? `${translate(translationKey)}: ` : '';

  return (
    <Tooltip tooltip={`${label}${tooltip || formattedValue}`}>
      <div className={classNames(styles.cell, className, { [styles.start]: start })} data-testid={dataTestId}>
        <span className={styles.cellValue}>{children || formattedValue}</span>
      </div>
    </Tooltip>
  );
};
