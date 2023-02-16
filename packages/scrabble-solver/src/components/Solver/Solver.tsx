import classNames from 'classnames';
import { FormEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { useMeasure } from 'react-use';

import { useMediaQuery } from 'hooks';
import { getCellSize } from 'lib';
import {
  COMPONENTS_SPACING,
  COMPONENTS_SPACING_MOBILE,
  DICTIONARY_HEIGHT,
  TILE_SIZE,
  WELL_BORDER_WIDTH,
} from 'parameters';
import { selectConfig, solveSlice, useTypedSelector } from 'state';

import Board from '../Board';
import Dictionary from '../Dictionary';
import DictionaryInput from '../DictionaryInput';
import Rack from '../Rack';
import Results from '../Results';
import Well from '../Well';

import styles from './Solver.module.scss';

interface Props {
  className?: string;
}

const Solver: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('<l', false);
  const [boardRef, { height: boardHeight }] = useMeasure<HTMLDivElement>();
  const [contentRef, { height: contentHeight, width: contentWidth }] = useMeasure<HTMLDivElement>();
  const [resultsContainerRef, { height: resultsContainerHeight, width: resultsContainerWidth }] =
    useMeasure<HTMLDivElement>();
  const config = useTypedSelector(selectConfig);
  const cellSize = getCellSize(config, contentWidth - resultsContainerWidth, contentHeight);
  const componentsSpacing = isMobile ? COMPONENTS_SPACING_MOBILE : COMPONENTS_SPACING;
  const resultsHeight = boardHeight - DICTIONARY_HEIGHT - componentsSpacing - 4 * WELL_BORDER_WIDTH;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(solveSlice.actions.submit());
  };

  return (
    <div className={classNames(styles.solver, className)}>
      <div className={styles.contentWrapper}>
        <div className={styles.content} ref={contentRef}>
          <form className={styles.boardContainer} onSubmit={handleSubmit}>
            {contentWidth > 0 && <Board cellSize={cellSize} innerRef={boardRef} />}
            <input className={styles.submitInput} tabIndex={-1} type="submit" />
          </form>

          <div className={styles.sidebar} style={{ height: boardHeight + 1 }}>
            <Well className={styles.resultsContainer} ref={resultsContainerRef}>
              {resultsContainerWidth > 0 && resultsContainerHeight > 0 && (
                <Results height={resultsHeight} width={resultsContainerWidth} />
              )}
            </Well>

            <Well>
              <div className={styles.dictionary} style={{ height: DICTIONARY_HEIGHT }}>
                <Dictionary className={styles.dictionaryOutput} />
                <DictionaryInput className={styles.dictionaryInput} />
              </div>
            </Well>
          </div>
        </div>
      </div>

      <form className={styles.rackContainer} onSubmit={handleSubmit}>
        <Rack className={styles.rack} tileSize={TILE_SIZE} />
        <input className={styles.submitInput} tabIndex={-1} type="submit" />
      </form>
    </div>
  );
};

export default Solver;
