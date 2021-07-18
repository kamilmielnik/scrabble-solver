import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { useTranslate } from 'state';
import { TranslationKey } from 'types';

import Tooltip from '../Tooltip';

import styles from './Results.module.scss';

interface Props {
  className?: string;
  translationKey: TranslationKey;
  value: string | number;
}

const Cell: FunctionComponent<Props> = ({ className, translationKey, value }) => {
  const translate = useTranslate();

  return (
    <Tooltip tooltip={`${translate(translationKey)}: ${value}`}>
      {({ ariaAttributes, setReferenceElement, onHide, onShow }) => (
        <span
          {...ariaAttributes}
          className={classNames(styles.cell, className)}
          ref={setReferenceElement}
          onBlur={onHide}
          onFocus={onShow}
          onMouseOut={onHide}
          onMouseOver={onShow}
        >
          {value}
        </span>
      )}
    </Tooltip>
  );
};

export default Cell;
