import classNames from 'classnames';
import { FunctionComponent, MouseEventHandler } from 'react';

import { ArrowDown, Flag, FlagFill, Square, SquareFill } from 'icons';
import { Translate } from 'types';

import Button from '../../../Button';

import styles from './Actions.module.scss';

interface Props {
  className?: string;
  direction: 'horizontal' | 'vertical';
  isBlank: boolean;
  isEmpty: boolean;
  isFiltered: boolean;
  translate: Translate;
  onDirectionToggle: MouseEventHandler<HTMLButtonElement>;
  onToggleBlank: MouseEventHandler<HTMLButtonElement>;
  onToggleFilterCell: MouseEventHandler<HTMLButtonElement>;
}

const Actions: FunctionComponent<Props> = ({
  className,
  direction,
  isBlank,
  isEmpty,
  isFiltered,
  translate,
  onDirectionToggle,
  onToggleBlank,
  onToggleFilterCell,
}) => (
  <div className={classNames(styles.actions, className)}>
    <Button
      aria-label={translate('cell.toggle-direction')}
      className={styles.action}
      Icon={ArrowDown}
      iconClassName={classNames(styles.toggleDirection, {
        [styles.right]: direction === 'horizontal',
      })}
      tooltip={translate('cell.toggle-direction')}
      onClick={onDirectionToggle}
    />

    {isEmpty && (
      <Button
        aria-label={translate('cell.filter-cell')}
        className={classNames(styles.action)}
        Icon={isFiltered ? Flag : FlagFill}
        tooltip={translate('cell.filter-cell')}
        onClick={onToggleFilterCell}
      />
    )}

    {!isEmpty && (
      <Button
        aria-label={isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}
        className={styles.action}
        Icon={isBlank ? SquareFill : Square}
        tooltip={isBlank ? translate('cell.set-not-blank') : translate('cell.set-blank')}
        onClick={onToggleBlank}
      />
    )}
  </div>
);

export default Actions;
