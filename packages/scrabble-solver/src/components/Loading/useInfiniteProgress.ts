import { useTween } from 'react-use';

const FOREVER = 365 * 24 * 60 * 60 * 1000;

const EXPECTED_DURATION = 1000; // after half of this amount of milliseconds, progress will be 50%

const estimateProgress = (elapsed: number, estimatedDuration: number): number => {
  const halfwayThreshold = estimatedDuration / 2;
  return (2 / Math.PI) * Math.atan(elapsed / halfwayThreshold);
};

const useInfiniteProgress = (expectedDuration: number = EXPECTED_DURATION): number => {
  const progress = useTween('linear', FOREVER);
  const elapsed = progress * FOREVER;
  return estimateProgress(elapsed, expectedDuration);
};

export default useInfiniteProgress;
