import classNames from 'classnames';
import { type FunctionComponent, type ReactNode, useMemo } from 'react';

import { LOCALE_FEATURES } from 'i18n';
import { COLOR_BLUE, COLOR_GREEN, COLOR_RED, COLOR_YELLOW } from 'parameters';
import { selectLocale, useTranslate, useTypedSelector } from 'state';
import { type Translations } from 'types';

import { PlainTiles } from '../PlainTiles';

import styles from './EmptyState.module.scss';

interface Props {
  children: ReactNode;
  className?: string;
  variant: 'error' | 'info' | 'success' | 'warning';
}

const TITLE_KEY_PER_TYPE: Record<Props['variant'], keyof Translations> = {
  error: 'empty-state.error',
  info: 'empty-state.info',
  success: 'empty-state.success',
  warning: 'empty-state.warning',
};

const COLORS_PER_TYPE: Record<Props['variant'], string> = {
  error: COLOR_RED,
  info: COLOR_BLUE,
  success: COLOR_GREEN,
  warning: COLOR_YELLOW,
};

export const EmptyState: FunctionComponent<Props> = ({ children, className, variant }) => {
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const { direction } = LOCALE_FEATURES[locale];
  const title = translate(TITLE_KEY_PER_TYPE[variant]);
  const message = direction === 'ltr' ? title : title.split('').reverse().join('');
  const content = useMemo(() => [message.toUpperCase().split(' ')], [message]);

  return (
    <div className={classNames(styles.emptyState, className)}>
      <PlainTiles className={styles.tiles} color={COLORS_PER_TYPE[variant]} content={content} />
      <div>{children}</div>
    </div>
  );
};
