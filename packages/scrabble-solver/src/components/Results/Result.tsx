import { CSSProperties, ReactElement, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useClickAway } from 'react-use';

import { useIsTouchDevice } from 'hooks';
import { LOCALE_FEATURES } from 'i18n';
import { resultsSlice, selectLocale, selectSortedFilteredResults, useTypedSelector } from 'state';

import Cell from './Cell';
import styles from './Results.module.scss';

interface Props {
  index: number;
  style?: CSSProperties;
}

const Result = ({ index, style }: Props): ReactElement => {
  const dispatch = useDispatch();
  const isTouchDevice = useIsTouchDevice();
  const ref = useRef<HTMLButtonElement>(null);
  const [isSelected, setIsSelected] = useState(false);
  const locale = useTypedSelector(selectLocale);
  const { consonants, vowels } = LOCALE_FEATURES[locale];
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const results = useTypedSelector(selectSortedFilteredResults)!;
  const result = results[index];
  const otherWords = result.words.slice(1).join(' / ').toLocaleUpperCase();

  useClickAway(ref, () => {
    if (isSelected) {
      setIsSelected(false);
    }
  });

  const handleClick = () => {
    if (isTouchDevice) {
      if (isSelected) {
        dispatch(resultsSlice.actions.applyResult(result));
        setIsSelected(false);
      } else {
        setIsSelected(true);
      }
    } else {
      dispatch(resultsSlice.actions.applyResult(result));
    }
  };

  const handleMouseEnter = () => {
    dispatch(resultsSlice.actions.changeResultCandidate(result));
  };

  const handleMouseLeave = () => {
    dispatch(resultsSlice.actions.changeResultCandidate(null));
  };

  const handleFocus = () => {
    dispatch(resultsSlice.actions.changeResultCandidate(result));
  };

  const handleBlur = () => {
    dispatch(resultsSlice.actions.changeResultCandidate(null));
  };

  return (
    <button
      className={styles.result}
      ref={ref}
      style={style}
      type="button"
      onBlur={handleBlur}
      onClick={handleClick}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={styles.resultContent}>
        <Cell
          className={styles.word}
          translationKey="common.word"
          value={`${result.word.toLocaleUpperCase()}${otherWords.length > 0 ? ` (${otherWords})` : ''}`}
        />
        <Cell className={styles.stat} translationKey="common.tiles" value={result.tilesCount} />
        {consonants && (
          <Cell className={styles.stat} translationKey="common.consonants" value={result.consonantsCount} />
        )}
        {vowels && <Cell className={styles.stat} translationKey="common.vowels" value={result.vowelsCount} />}
        <Cell className={styles.stat} translationKey="common.blanks" value={result.blanksCount} />
        <Cell
          className={styles.stat}
          translationKey="common.words"
          tooltip={`${result.wordsCount} (${result.words.join(' / ').toLocaleUpperCase()})`}
          value={result.wordsCount}
        />
        <Cell className={styles.points} translationKey="common.points" value={result.points} />
      </span>
    </button>
  );
};

export default Result;
