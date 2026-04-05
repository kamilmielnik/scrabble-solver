import { createContext, type FunctionComponent, type ReactNode, useContext } from 'react';

import { type AppLayout, useAppLayoutValue } from './useAppLayoutValue';

const AppLayoutContext = createContext<AppLayout | null>(null);

export const useAppLayout = () => {
  const context = useContext(AppLayoutContext);

  if (context === null) {
    throw new Error('useAppLayout must be used within an <AppLayoutProvider />');
  }

  return context;
};

interface Props {
  children: ReactNode;
}

export const AppLayoutProvider: FunctionComponent<Props> = ({ children }) => {
  const appLayout = useAppLayoutValue();

  return <AppLayoutContext.Provider value={appLayout}>{children}</AppLayoutContext.Provider>;
};
