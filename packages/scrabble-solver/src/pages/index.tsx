import { isObject } from '@scrabble-solver/types';
import fs from 'fs';
import path from 'path';
import { type FunctionComponent, useState } from 'react';
import ReactModal from 'react-modal';
import { useDispatch } from 'react-redux';

import { Logo, NavButtons, Solver } from 'components';
import { useDirection, useEffectOnce, useLanguage, useLocalStorage } from 'hooks';
import { LOCALE_FEATURES } from 'i18n';
import {
  DictionaryModal,
  KeyMapModal,
  MenuModal,
  RemainingTilesModal,
  ResultsModal,
  SettingsModal,
  WordsModal,
} from 'modals';
import { registerServiceWorker } from 'serviceWorkerManager';
import { initialize, reset, selectConfig, selectLocale, useTypedSelector } from 'state';

import styles from './index.module.scss';

ReactModal.setAppElement('#__next');

interface Props {
  version: string;
}

type Modal = 'dictionary' | 'keyMap' | 'menu' | 'remainingTiles' | 'results' | 'settings' | 'words';

// eslint-disable-next-line max-statements
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
  const setModal = (modal: Modal, isOpen: boolean) => {
    return setModals((current) => ({ ...current, [modal]: isOpen }));
  };

  const handleClear = () => dispatch(reset());
  const handleHideDictionary = () => setModal('dictionary', false);
  const handleHideKeyMap = () => setModal('keyMap', false);
  const handleHideMenu = () => setModal('menu', false);
  const handleHideRemainingTiles = () => setModal('remainingTiles', false);
  const handleHideResults = () => setModal('results', false);
  const handleHideSettings = () => setModal('settings', false);
  const handleHideWords = () => setModal('words', false);
  const handleShowDictionary = () => setModal('dictionary', true);
  const handleShowKeyMap = () => setModal('keyMap', true);
  const handleShowMenu = () => setModal('menu', true);
  const handleShowRemainingTiles = () => setModal('remainingTiles', true);
  const handleShowResults = () => setModal('results', true);
  const handleShowSettings = () => setModal('settings', true);
  const handleShowWords = () => setModal('words', true);

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

      <Solver className={styles.solver} onShowResults={handleShowResults} />

      <MenuModal
        isOpen={modals.menu}
        onClose={handleHideMenu}
        onShowDictionary={handleShowDictionary}
        onShowRemainingTiles={handleShowRemainingTiles}
        onShowSettings={handleShowSettings}
        onShowWords={handleShowWords}
      />

      <SettingsModal isOpen={modals.settings} onClose={handleHideSettings} />

      <KeyMapModal isOpen={modals.keyMap} onClose={handleHideKeyMap} />

      <WordsModal isOpen={modals.words} onClose={handleHideWords} />

      {config.supportsRemainingTiles && (
        <RemainingTilesModal isOpen={modals.remainingTiles} onClose={handleHideRemainingTiles} />
      )}

      <ResultsModal isOpen={modals.results} onClose={handleHideResults} />

      <DictionaryModal isOpen={modals.dictionary} onClose={handleHideDictionary} />
    </>
  );
};

export const getStaticProps = async (): Promise<{ props: Props }> => {
  const version = await readVersion();
  return { props: { version } };
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
