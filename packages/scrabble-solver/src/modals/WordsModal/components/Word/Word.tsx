import { type BoardWord } from '@scrabble-solver/types';
import classNames from 'classnames';
import { type FunctionComponent, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Check from '@/icons/Check.svg';
import Cross from '@/icons/Cross.svg';
import { hoveredWordSlice } from '@/state';

import styles from './Word.module.scss';

interface Props {
  isValid: boolean;
  word: BoardWord;
}

export const Word: FunctionComponent<Props> = ({ isValid, word }) => {
  const dispatch = useDispatch();
  const Icon = isValid ? Check : Cross;

  const handleMouseEnter = useCallback(() => {
    dispatch(hoveredWordSlice.actions.set(word));
  }, [dispatch, word]);

  const handleMouseLeave = useCallback(() => {
    dispatch(hoveredWordSlice.actions.clear());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(hoveredWordSlice.actions.clear());
    };
  }, [dispatch]);

  return (
    <div
      className={styles.word}
      data-testid={`word-${word.x}-${word.y}-${word.direction}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Icon
        aria-hidden="true"
        className={classNames(styles.icon, isValid ? styles.valid : styles.invalid)}
        role="img"
      />{' '}
      {word.word}
    </div>
  );
};
