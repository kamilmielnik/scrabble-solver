import React, { ReactNode, useLayoutEffect, useMemo } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Portal } from 'react-portal';

import { canUseDom, noop } from 'lib';

interface Props {
  disabled?: boolean;
  tagName?: TagName;
}

type TagName = Parameters<typeof document.createElement>[0];

const usePortal = (children: ReactNode, { disabled = false, tagName = 'div' }: Props = {}): void => {
  const element = useMemo(() => document.createElement(tagName), [tagName]);

  useLayoutEffect(() => {
    if (disabled) {
      return noop;
    }

    document.body.appendChild(element);

    return () => {
      unmountComponentAtNode(element);
      document.body.removeChild(element);
    };
  }, [disabled, element]);

  useLayoutEffect(() => {
    if (!disabled) {
      render(<Portal>{children}</Portal>, element);
    }
  }, [children, disabled, element]);
};

export default canUseDom ? usePortal : noop;
