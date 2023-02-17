import classNames from 'classnames';
import { FunctionComponent, HTMLProps } from 'react';

import { ChevronDown } from 'icons';

import styles from './ResultPicker.module.scss';

interface Props extends HTMLProps<HTMLButtonElement> {
  className?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

const ResultPicker: FunctionComponent<Props> = ({ className, ...props }) => {
  return (
    <button className={classNames(styles.resultPicker, className)} type="button" {...props}>
      <div className={styles.points}>328</div>
      <div className={styles.word}>Essentially</div>
      <div className={styles.iconContainer}>
        <ChevronDown className={styles.icon} />
      </div>
    </button>
  );
};

export default ResultPicker;
