import fs from 'fs';
import path from 'path';
import { FunctionComponent, useCallback, useState } from 'react';
import ReactModal from 'react-modal';
import { useDispatch } from 'react-redux';

import { Logo, NavButtons, Solver, SvgFontFix } from 'components';
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
import { initialize, reset, selectLocale, useTypedSelector } from 'state';

import styles from './index.module.scss';

ReactModal.setAppElement('#__next');

interface Props {
  version: string;
}

// eslint-disable-next-line max-statements
const Index: FunctionComponent<Props> = ({ version }) => {
  const dispatch = useDispatch();
  const locale = useTypedSelector(selectLocale);
  const [showDictionary, setShowDictionary] = useState(false);
  const [showKeyMap, setShowKeyMap] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showRemainingTiles, setShowRemainingTiles] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const handleShowResults = useCallback(() => setShowResults(true), []);
  const handleClear = useCallback(() => dispatch(reset()), [dispatch]);
  const handleHideDictionary = useCallback(() => setShowDictionary(false), []);
  const handleHideKeyMap = useCallback(() => setShowKeyMap(false), []);
  const handleHideRemainingTiles = useCallback(() => setShowRemainingTiles(false), []);
  const handleHideResults = useCallback(() => setShowResults(false), []);
  const handleHideSettings = useCallback(() => setShowSettings(false), []);
  const handleHideWords = useCallback(() => setShowWords(false), []);
  const handleShowDictionary = useCallback(() => setShowDictionary(true), []);
  const handleShowKeyMap = useCallback(() => setShowKeyMap(true), []);
  const handleShowMenu = useCallback(() => setShowMenu(true), []);
  const handleShowRemainingTiles = useCallback(() => setShowRemainingTiles(true), []);
  const handleShowSettings = useCallback(() => setShowSettings(true), []);
  const handleShowWords = useCallback(() => setShowWords(true), []);

  useDirection(LOCALE_FEATURES[locale].direction);
  useLanguage(locale);
  useLocalStorage();

  useEffectOnce(() => {
    if (process.env.NODE_ENV === 'production') {
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
      <SvgFontFix />

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
        isOpen={showMenu}
        onClose={handleShowMenu}
        onShowDictionary={handleShowDictionary}
        onShowRemainingTiles={handleShowRemainingTiles}
        onShowSettings={handleShowSettings}
        onShowWords={handleShowWords}
      />

      <SettingsModal isOpen={showSettings} onClose={handleHideSettings} />

      <KeyMapModal isOpen={showKeyMap} onClose={handleHideKeyMap} />

      <WordsModal isOpen={showWords} onClose={handleHideWords} />

      <RemainingTilesModal isOpen={showRemainingTiles} onClose={handleHideRemainingTiles} />

      <ResultsModal isOpen={showResults} onClose={handleHideResults} />

      <DictionaryModal isOpen={showDictionary} onClose={handleHideDictionary} />
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
  return `v${packageJson.version}`;
};

export default Index;
