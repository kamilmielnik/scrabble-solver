/* eslint-disable max-lines, max-statements */

import { games } from '@scrabble-solver/configs';
import { isObject } from '@scrabble-solver/types';
import { execSync } from 'child_process';
import fs from 'fs';
import dynamic from 'next/dynamic';
import path from 'path';
import { type FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Logo } from '@/components/Logo';
import { NavButtons } from '@/components/NavButtons';
import { Solver } from '@/components/Solver';
import { useDirection } from '@/hooks/useDirection';
import { useEffectOnce } from '@/hooks/useEffectOnce';
import { useLanguage } from '@/hooks/useLanguage';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { LOCALE_FEATURES } from '@/i18n/constants';
import { schedulePreloadModals } from '@/modals/preload';
import { CONFIG_PENDING_CLASS } from '@/parameters';
import { registerServiceWorker } from '@/serviceWorkerManager';
import { initialize, reset, selectConfig, selectIsHydrated, selectLocale, useTypedSelector } from '@/state';

import styles from './index.module.scss';

const DictionaryModal = dynamic(() => import('@/modals/DictionaryModal').then((module) => module.DictionaryModal), {
  ssr: false,
});
const KeyMapModal = dynamic(() => import('@/modals/KeyMapModal').then((module) => module.KeyMapModal), {
  ssr: false,
});
const MenuModal = dynamic(() => import('@/modals/MenuModal').then((module) => module.MenuModal), {
  ssr: false,
});
const RemainingTilesModal = dynamic(
  () => import('@/modals/RemainingTilesModal').then((module) => module.RemainingTilesModal),
  {
    ssr: false,
  },
);
const ResultsModal = dynamic(() => import('@/modals/ResultsModal').then((module) => module.ResultsModal), {
  ssr: false,
});
const SettingsModal = dynamic(() => import('@/modals/SettingsModal').then((module) => module.SettingsModal), {
  ssr: false,
});
const WordsModal = dynamic(() => import('@/modals/WordsModal').then((module) => module.WordsModal), {
  ssr: false,
});

interface Props {
  version: string;
}

type Modal = 'dictionary' | 'keyMap' | 'menu' | 'remainingTiles' | 'results' | 'settings' | 'words';

const Index: FunctionComponent<Props> = ({ version }) => {
  const dispatch = useDispatch();
  const config = useTypedSelector(selectConfig);
  const locale = useTypedSelector(selectLocale);
  const isHydrated = useTypedSelector(selectIsHydrated);
  const [modals, setModals] = useState<Record<Modal, boolean>>({
    dictionary: false,
    keyMap: false,
    menu: false,
    remainingTiles: false,
    results: false,
    settings: false,
    words: false,
  });
  const [mountedModals, setMountedModals] = useState<Partial<Record<Modal, boolean>>>({});

  const patchModals = useCallback((patch: Partial<Record<Modal, boolean>>) => {
    setModals((current) => ({ ...current, ...patch }));
    setMountedModals((current) => {
      const newModals = Object.keys(patch) as Modal[];
      const newOpenedModals = newModals.filter((modal) => patch[modal] && !current[modal]);

      if (newOpenedModals.length === 0) {
        return current;
      }

      const mounted = { ...current };

      for (const modal of newOpenedModals) {
        mounted[modal] = true;
      }

      return mounted;
    });
  }, []);

  const handleClear = useCallback(() => dispatch(reset()), [dispatch]);

  const handleShowDictionary = useCallback(() => patchModals({ dictionary: true }), [patchModals]);
  const handleShowKeyMap = useCallback(() => patchModals({ keyMap: true }), [patchModals]);
  const handleShowMenu = useCallback(() => patchModals({ menu: true }), [patchModals]);
  const handleShowRemainingTiles = useCallback(() => patchModals({ remainingTiles: true }), [patchModals]);
  const handleShowResults = useCallback(() => patchModals({ results: true }), [patchModals]);
  const handleShowSettings = useCallback(() => patchModals({ settings: true }), [patchModals]);
  const handleShowWords = useCallback(() => patchModals({ words: true }), [patchModals]);
  const handleCloseDictionary = useCallback(() => patchModals({ dictionary: false }), [patchModals]);
  const handleCloseKeyMap = useCallback(() => patchModals({ keyMap: false }), [patchModals]);
  const handleCloseMenu = useCallback(() => patchModals({ menu: false }), [patchModals]);
  const handleCloseRemainingTiles = useCallback(() => patchModals({ remainingTiles: false }), [patchModals]);
  const handleCloseResults = useCallback(() => patchModals({ results: false }), [patchModals]);
  const handleCloseSettings = useCallback(() => patchModals({ settings: false }), [patchModals]);
  const handleCloseWords = useCallback(() => patchModals({ words: false }), [patchModals]);

  useDirection(LOCALE_FEATURES[locale].direction);
  useLanguage(locale);
  useLocalStorage();

  useEffect(() => {
    const root = document.documentElement;
    const variables = [
      { name: '--board-cols', value: config.boardWidth, defaultValue: games.scrabble.boardWidth },
      { name: '--board-rows', value: config.boardHeight, defaultValue: games.scrabble.boardHeight },
      { name: '--rack-size', value: config.rackSize, defaultValue: games.scrabble.rackSize },
    ];

    for (const { name, value, defaultValue } of variables) {
      const current = root.style.getPropertyValue(name) || String(defaultValue);

      if (current !== String(value)) {
        root.style.setProperty(name, String(value));
      }
    }
  }, [config.boardHeight, config.boardWidth, config.rackSize]);

  useEffect(() => {
    if (isHydrated) {
      document.documentElement.classList.remove(CONFIG_PENDING_CLASS);
    }
  }, [isHydrated]);

  useEffectOnce(() => {
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      registerServiceWorker();
    }

    dispatch(initialize({ version }));
    schedulePreloadModals();
  });

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.navLogo}>
            <a className={styles.logoContainer} href="/" title={version}>
              <Logo className={styles.logo} />
            </a>
          </div>

          <NavButtons
            onClear={handleClear}
            onShowKeyMap={handleShowKeyMap}
            onShowMenu={handleShowMenu}
            onShowRemainingTiles={handleShowRemainingTiles}
            onShowSettings={handleShowSettings}
            onShowWords={handleShowWords}
          />
        </div>
      </nav>

      <main>
        <Solver className={styles.solver} onShowResults={handleShowResults} />
      </main>

      {mountedModals.menu && (
        <MenuModal
          isOpen={modals.menu}
          onClose={handleCloseMenu}
          onShowDictionary={handleShowDictionary}
          onShowRemainingTiles={handleShowRemainingTiles}
          onShowSettings={handleShowSettings}
          onShowWords={handleShowWords}
        />
      )}

      {mountedModals.settings && <SettingsModal isOpen={modals.settings} onClose={handleCloseSettings} />}

      {mountedModals.keyMap && <KeyMapModal isOpen={modals.keyMap} onClose={handleCloseKeyMap} />}

      {mountedModals.words && <WordsModal isOpen={modals.words} onClose={handleCloseWords} />}

      {config.supportsRemainingTiles && mountedModals.remainingTiles && (
        <RemainingTilesModal isOpen={modals.remainingTiles} onClose={handleCloseRemainingTiles} />
      )}

      {mountedModals.results && <ResultsModal isOpen={modals.results} onClose={handleCloseResults} />}

      {mountedModals.dictionary && <DictionaryModal isOpen={modals.dictionary} onClose={handleCloseDictionary} />}
    </>
  );
};

export const getStaticProps = async () => {
  const version = await readVersion();
  // Inlined into __NEXT_DATA__ so the page-data hash (which feeds Next.js's SSG ETag)
  // changes per build, letting browsers cache HTML and 304 within a build but pull
  // fresh markup after a deploy. Not consumed by the component.
  const buildSha = execSync('git rev-parse HEAD').toString().trim();
  return { props: { version, buildSha } };
};

const readVersion = async (): Promise<string> => {
  const packageJsonFilepath = path.resolve(process.cwd(), 'package.json');
  const data = await fs.promises.readFile(packageJsonFilepath, 'utf-8');
  const packageJson = JSON.parse(data);

  if (!isObject(packageJson) || !('version' in packageJson) || typeof packageJson.version !== 'string') {
    throw new Error('Invalid package.json');
  }

  return `v${packageJson.version}`;
};

export default Index;
