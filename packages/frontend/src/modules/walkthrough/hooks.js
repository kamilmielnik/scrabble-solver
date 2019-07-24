import { useSelector } from 'react-redux';

import { selectShowWalkthrough, selectSteps, selectTranslations } from './selectors';

export const useShowWalkthrough = () => useSelector(selectShowWalkthrough);

export const useSteps = () => useSelector(selectSteps);

export const useTranslations = () => useSelector(selectTranslations);
