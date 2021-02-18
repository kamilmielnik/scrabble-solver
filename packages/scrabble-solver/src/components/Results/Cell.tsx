import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { useTranslate } from 'state';
import { TranslationKey } from 'types';

import styles from './Results.module.scss';

interface Props {
  className?: string;
  translationKey: TranslationKey;
  value: string | number;
}

const Cell: FunctionComponent<Props> = ({ className, translationKey, value }) => {
  const translate = useTranslate();

  return (
    <span className={classNames(styles.cell, className)} title={`${translate(translationKey)}: ${value}`}>
      {value}
    </span>
  );
};

export default Cell;
