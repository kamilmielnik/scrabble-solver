import { Result } from '@scrabble-solver/types';
import { FunctionComponent, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useMeasure } from 'react-use';

import { Modal, Results, Sizer } from 'components';
import { useMediaQuery } from 'hooks';
import {
  resultsSlice,
  selectResultCandidate,
  selectSortedFilteredResults,
  useTranslate,
  useTypedSelector,
} from 'state';

import styles from './ResultsModal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ResultsModal: FunctionComponent<Props> = ({ className, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const [sizerRef, { height, width }] = useMeasure<HTMLDivElement>();
  const isLessThanS = useMediaQuery('<s');
  const results = useTypedSelector(selectSortedFilteredResults);
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const index = (results || []).findIndex((result) => result.id === resultCandidate?.id);
  const highlightedIndex = index === -1 ? undefined : index;

  const callbacks = useMemo(
    () => ({
      onClick: (result: Result) => {
        dispatch(resultsSlice.actions.changeResultCandidate(result));

        if (isLessThanS) {
          onClose();
        }
      },
    }),
    [dispatch, isLessThanS, onClose],
  );

  return (
    <Modal className={className} isOpen={isOpen} title={translate('results')} onClose={onClose}>
      <div className={styles.content}>
        <Sizer ref={sizerRef} />

        <Results callbacks={callbacks} height={height} highlightedIndex={highlightedIndex} width={width} />
      </div>
    </Modal>
  );
};

export default ResultsModal;
