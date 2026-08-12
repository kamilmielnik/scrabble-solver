import { waitForIdleOrFirstIntent } from '@/lib/waitForIdleOrFirstIntent';

let isScheduled = false;

export function schedulePreloadModals(): void {
  if (isScheduled || typeof window === 'undefined') {
    return;
  }

  isScheduled = true;

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  waitForIdleOrFirstIntent().then(() =>
    Promise.all([
      import('./DictionaryModal'),
      import('./KeyMapModal'),
      import('./MenuModal'),
      import('./RemainingTilesModal'),
      import('./ResultsModal'),
      import('./SettingsModal'),
      import('./WordsModal'),
    ]),
  );
}
