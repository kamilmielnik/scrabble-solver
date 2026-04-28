/* eslint-disable max-statements */

import { isObject } from '@scrabble-solver/types';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { type FunctionComponent, useCallback, useState } from 'react';
import ReactModal from 'react-modal';
import { useDispatch } from 'react-redux';

import { Logo, NavButtons, Solver } from '@/components';
import { useDirection, useEffectOnce, useLanguage, useLocalStorage } from '@/hooks';
import { LOCALE_FEATURES } from '@/i18n';
import {
  DictionaryModal,
  KeyMapModal,
  MenuModal,
  RemainingTilesModal,
  ResultsModal,
  SettingsModal,
  WordsModal,
} from '@/modals';
import { registerServiceWorker } from '@/serviceWorkerManager';
import { initialize, reset, selectConfig, selectLocale, useTypedSelector } from '@/state';

import styles from './index.module.scss';

ReactModal.setAppElement('#__next');

interface Props {
  version: string;
}

type Modal = 'dictionary' | 'keyMap' | 'menu' | 'remainingTiles' | 'results' | 'settings' | 'words';

const Index: FunctionComponent<Props> = ({ version }) => {
  const dispatch = useDispatch();
  const config = useTypedSelector(selectConfig);
  const locale = useTypedSelector(selectLocale);
  const [isClient, setIsClient] = useState(false);
  const [modals, setModals] = useState<Record<Modal, boolean>>({
    dictionary: false,
    keyMap: false,
    menu: false,
    remainingTiles: false,
    results: false,
    settings: false,
    words: false,
  });

  const patchModals = useCallback((patch: Partial<Record<Modal, boolean>>) => {
    setModals((current) => ({ ...current, ...patch }));
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

  useEffectOnce(() => {
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      registerServiceWorker();
    }

    setIsClient(true);
    dispatch(initialize());
  });

  if (!isClient) {
    return null;
  }

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

      <MenuModal
        isOpen={modals.menu}
        onClose={handleCloseMenu}
        onShowDictionary={handleShowDictionary}
        onShowRemainingTiles={handleShowRemainingTiles}
        onShowSettings={handleShowSettings}
        onShowWords={handleShowWords}
      />

      <SettingsModal isOpen={modals.settings} onClose={handleCloseSettings} />

      <KeyMapModal isOpen={modals.keyMap} onClose={handleCloseKeyMap} />

      <WordsModal isOpen={modals.words} onClose={handleCloseWords} />

      {config.supportsRemainingTiles && (
        <RemainingTilesModal isOpen={modals.remainingTiles} onClose={handleCloseRemainingTiles} />
      )}

      <ResultsModal isOpen={modals.results} onClose={handleCloseResults} />

      <DictionaryModal isOpen={modals.dictionary} onClose={handleCloseDictionary} />
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
