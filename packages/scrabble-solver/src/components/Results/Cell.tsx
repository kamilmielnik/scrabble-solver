import classNames from 'classnames';
import { FunctionComponent } from 'react';

import { useFormatNumber, useTranslate } from 'state';
import { TranslationKey } from 'types';

import { useTooltip } from '../Tooltip';

import styles from './Results.module.scss';

interface Props {
  className?: string;
  translationKey: TranslationKey;
  tooltip?: string | number;
  value: string | number;
}

const Cell: FunctionComponent<Props> = ({ className, translationKey, tooltip, value }) => {
  const translate = useTranslate();
  const formatNumber = useFormatNumber();
  const formattedValue = typeof value === 'string' ? value : formatNumber(value);
  const triggerProps = useTooltip(`${translate(translationKey)}: ${tooltip || formattedValue}`);

  return (
    <span className={classNames(styles.cell, className)} {...triggerProps}>
      {formattedValue}
    </span>
  );
};

export default Cell;
