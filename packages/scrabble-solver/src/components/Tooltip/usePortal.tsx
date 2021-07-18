import { ReactNode, useLayoutEffect, useMemo } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Portal } from 'react-portal';

import { noop } from 'lib';

type TagName = Parameters<typeof document.createElement>[0];

const canUseDom = typeof window !== 'undefined' && window.document && window.document.createElement;

const usePortal = (children: ReactNode, tagName: TagName = 'div'): void => {
  const element = useMemo(() => document.createElement(tagName), [tagName]);

  useLayoutEffect(() => {
    document.body.appendChild(element);

    return () => {
      unmountComponentAtNode(element);
      document.body.removeChild(element);
    };
  }, [element]);

  useLayoutEffect(() => {
    render(<Portal>{children}</Portal>, element);
  }, [children, element]);
};

export default canUseDom ? usePortal : noop;
