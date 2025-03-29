import classNames from 'classnames';
import { FunctionComponent, useMemo } from 'react';

import { LOCALE_FEATURES } from 'i18n';
import { selectLocale, useTranslate, useTypedSelector } from 'state';

import { PlainTiles } from '../PlainTiles';

import styles from './Loading.module.scss';

interface Props {
  children?: never;
  className?: string;
  wave?: boolean;
}

export const Loading: FunctionComponent<Props> = ({ className, wave = true }) => {
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const { direction } = LOCALE_FEATURES[locale];
  const translation = translate('common.loading');
  const message = direction === 'ltr' ? translation : translation.split('').reverse().join('');
  const content = useMemo(() => {
    const uppercased = message.toLocaleUpperCase();
    const parts = uppercased.split(' ');
    return [parts];
  }, [message]);

  return (
    <div aria-label={translation} className={classNames(styles.loading, className)} data-testid="loading" role="status">
      <div className={styles.dim} />
      <div className={styles.text}>
        <PlainTiles className={classNames(styles.tiles)} content={content} dropShadow wave={wave} />
      </div>
    </div>
  );
};
