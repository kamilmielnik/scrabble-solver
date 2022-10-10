import classNames from 'classnames';
import { FunctionComponent } from 'react';

import { useTranslate } from 'state';
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
  const triggerProps = useTooltip(`${translate(translationKey)}: ${tooltip || value}`);

  return (
    <span className={classNames(styles.cell, className)} {...triggerProps}>
      {value}
    </span>
  );
};

export default Cell;
