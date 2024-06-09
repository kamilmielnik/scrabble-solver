import { createContext, useContext } from 'react';

import { useTooltip } from './useTooltip';

type TooltipContextType = ReturnType<typeof useTooltip> | null;

export const TooltipContext = createContext<TooltipContextType>(null);

export const useTooltipContext = () => {
  const context = useContext(TooltipContext);

  if (context === null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }

  return context;
};
