import classNames from 'classnames';
import fs from 'fs';
import path from 'path';
import { FunctionComponent, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import { Logo, LogoSplashScreen, NavButtons, Solver, SvgFontFix } from 'components';
import { useAppLayout, useDirection, useLanguage, useLocalStorage } from 'hooks';
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
  const { showResultsInModal } = useAppLayout();
  const [showDictionary, setShowDictionary] = useState(false);
  const [showKeyMap, setShowKeyMap] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showRemainingTiles, setShowRemainingTiles] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const handleClear = () => {
    dispatch(reset());
  };

  useDirection(LOCALE_FEATURES[locale].direction);
  useLanguage(locale);
  useLocalStorage();

  useEffectOnce(() => {
    setIsClient(true);
    dispatch(initialize());
    setIsInitialized(true);
  });

  useEffect(() => {
    if (!showResultsInModal) {
      setShowResults(false);
    }
  }, [showResultsInModal]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    }
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <SvgFontFix />

      <div className={classNames(styles.index, { [styles.initialized]: isInitialized })}>
        <nav className={styles.nav}>
          <div className={styles.navContent}>
            <div className={styles.navLogo}>
              <a className={styles.logoContainer} href="/" title={version}>
                <Logo className={styles.logo} />
              </a>
            </div>

            <NavButtons
              onClear={handleClear}
              onShowKeyMap={() => setShowKeyMap(true)}
              onShowMenu={() => setShowMenu(true)}
              onShowRemainingTiles={() => setShowRemainingTiles(true)}
              onShowSettings={() => setShowSettings(true)}
              onShowWords={() => setShowWords(true)}
            />
          </div>
        </nav>

        <Solver className={styles.solver} onShowResults={() => setShowResults(true)} />
      </div>

      <MenuModal
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        onShowDictionary={() => setShowDictionary(true)}
        onShowRemainingTiles={() => setShowRemainingTiles(true)}
        onShowSettings={() => setShowSettings(true)}
        onShowWords={() => setShowWords(true)}
      />

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <KeyMapModal isOpen={showKeyMap} onClose={() => setShowKeyMap(false)} />

      <WordsModal isOpen={showWords} onClose={() => setShowWords(false)} />

      <RemainingTilesModal isOpen={showRemainingTiles} onClose={() => setShowRemainingTiles(false)} />

      <ResultsModal isOpen={showResults} onClose={() => setShowResults(false)} />

      <DictionaryModal isOpen={showDictionary} onClose={() => setShowDictionary(false)} />

      <LogoSplashScreen forceShow={!isInitialized} />
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
