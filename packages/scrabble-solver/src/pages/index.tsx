import classNames from 'classnames';
import fs from 'fs';
import path from 'path';
import { AnimationEvent, FunctionComponent, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';

import {
  KeyMap,
  Logo,
  Menu,
  NavButtons,
  RemainingTiles,
  Settings,
  Solver,
  SolverMobile,
  Splash,
  SquareButton,
  SvgFontFix,
  Words,
} from 'components';
import { useDirection, useLanguage, useLocalStorage, useMediaQuery } from 'hooks';
import { LOCALE_FEATURES } from 'i18n';
import { INITIALIZATION_DURATION } from 'parameters';
import { registerServiceWorker } from 'serviceWorkerManager';
import { initialize, localStorage, reset, selectLocale, useTranslate, useTypedSelector } from 'state';

import styles from './index.module.scss';
import { List } from 'icons';

Modal.setAppElement('#__next');

interface Props {
  version: string;
}

const Index: FunctionComponent<Props> = ({ version }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const locale = useTypedSelector(selectLocale);
  const [showKeyMap, setShowKeyMap] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showRemainingTiles, setShowRemainingTiles] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const isMobile = useMediaQuery('<m');
  const SolverComponent = isMobile ? SolverMobile : Solver;

  const handleClear = () => {
    dispatch(reset());
  };

  const handleSplashAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !localStorage.getHasVisited()) {
      setShowSettings(true);
      localStorage.setHasVisited(true);
    }
  };

  useDirection(LOCALE_FEATURES[locale].direction);
  useLanguage(locale);
  useLocalStorage();

  useEffectOnce(() => {
    dispatch(initialize());

    setTimeout(() => {
      setIsInitialized(true);
    }, INITIALIZATION_DURATION);
  });

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    }
  }, []);

  return (
    <>
      <SvgFontFix />

      <div className={classNames(styles.index, { [styles.initialized]: isInitialized })}>
        <div className={styles.nav}>
          <div className={styles.navLogo}>
            <a className={styles.logoContainer} href="/" title={version}>
              <Logo className={styles.logo} />
            </a>
          </div>

          {!isMobile && (
            <NavButtons
              onClear={handleClear}
              onShowKeyMap={() => setShowKeyMap(true)}
              onShowRemainingTiles={() => setShowRemainingTiles(true)}
              onShowSettings={() => setShowSettings(true)}
              onShowWords={() => setShowWords(true)}
            />
          )}

          {isMobile && (
            <SquareButton
              className={classNames(styles.button)}
              Icon={List}
              tooltip={translate('menu')}
              onClick={() => setShowMenu(true)}
            />
          )}
        </div>

        <SolverComponent className={styles.solver} />
      </div>

      <Menu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        onShowRemainingTiles={() => setShowRemainingTiles(true)}
        onShowSettings={() => setShowSettings(true)}
        onShowWords={() => setShowWords(true)}
      />
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <KeyMap isOpen={showKeyMap} onClose={() => setShowKeyMap(false)} />
      <Words isOpen={showWords} onClose={() => setShowWords(false)} />
      <RemainingTiles isOpen={showRemainingTiles} onClose={() => setShowRemainingTiles(false)} />
      <Splash forceShow={!isInitialized} onAnimationEnd={handleSplashAnimationEnd} />
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
