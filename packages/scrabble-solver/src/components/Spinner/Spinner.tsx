import classNames from 'classnames';
import { FunctionComponent } from 'react';

import { useTranslate } from 'state';

import styles from './Spinner.module.scss';

interface Props {
  className?: string;
}

export const Spinner: FunctionComponent<Props> = ({ className }) => {
  const translate = useTranslate();
  const translation = translate('common.loading');

  return <div aria-label={translation} className={classNames(styles.spinner, className)} role="status" />;
};
