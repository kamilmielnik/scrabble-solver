import classNames from 'classnames';
import { CSSProperties, FunctionComponent, ReactNode } from 'react';

import { selectLocale, useTranslate, useTypedSelector } from 'state';
import { TranslationKey } from 'types';

import { Tooltip } from '../Tooltip';

import styles from './Results.module.scss';

interface Props {
  children?: ReactNode;
  className?: string;
  dataTestId?: string;
  style?: CSSProperties;
  translationKey: TranslationKey;
  tooltip?: string | number;
  value: string | number;
}

export const Cell: FunctionComponent<Props> = ({
  children,
  className,
  dataTestId,
  style,
  translationKey,
  tooltip,
  value,
}) => {
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const formattedValue = value.toLocaleString(locale);

  return (
    <Tooltip tooltip={`${translate(translationKey)}: ${tooltip || formattedValue}`}>
      <div className={classNames(styles.cell, className)} data-testid={dataTestId} style={style}>
        {children || formattedValue}
      </div>
    </Tooltip>
  );
};
