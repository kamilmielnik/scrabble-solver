import React, { ReactNode, useLayoutEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Portal } from 'react-portal';

import { canUseDom, noop } from 'lib';

interface Props {
  disabled?: boolean;
  tagName?: TagName;
}

type TagName = Parameters<typeof document.createElement>[0];

const usePortal = (children: ReactNode, { disabled = false, tagName = 'div' }: Props = {}): void => {
  const rootRef = useRef<Root | null>(null);

  useLayoutEffect(() => {
    if (disabled) {
      return noop;
    }

    const element = document.createElement(tagName);
    document.body.appendChild(element);
    const root = createRoot(element);
    rootRef.current = root;

    return () => {
      // We need setTimeout for async unmount, otherwise we get this warning:
      // "Attempted to synchronously unmount a root while React was already
      // rendering. React cannot finish unmounting the root until the current
      // render has completed, which may lead to a race condition.""
      setTimeout(() => {
        rootRef.current = null;
        root.unmount();
        element.remove();
      }, 0);
    };
  }, [disabled, tagName]);

  useLayoutEffect(() => {
    if (rootRef.current) {
      rootRef.current.render(<Portal>{children}</Portal>);
    }
  }, [children, disabled, rootRef]);
};

export default canUseDom ? usePortal : noop;
