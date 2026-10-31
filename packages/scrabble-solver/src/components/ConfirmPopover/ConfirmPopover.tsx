import {
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { type FunctionComponent, type ReactElement, cloneElement, useState } from 'react';

import { useTranslate } from '@/state';

import { Button } from '../Button';

import styles from './ConfirmPopover.module.scss';

const GAP = 6;
const PADDING = 10;

interface Props {
  /** The single control that opens the popover; receives the trigger props. */
  children: ReactElement<Record<string, unknown>>;
  confirmLabel: string;
  message: string;
  onConfirm: () => void;
}

/**
 * Asks before doing something destructive, in a popover anchored to the
 * control that triggered it.
 *
 * A popover rather than a modal because this renders on first paint: the
 * `Modal` component pulls in react-modal, which currently sits in a lazily
 * loaded chunk that the index page does not download, whereas floating-ui is
 * already there for tooltips. Building this out of what is already loaded
 * keeps a confirmation step from costing the boot budget anything.
 *
 * Unlike `Tooltip`, which is hover-driven and switches itself off on touch
 * devices, this is click-driven and so works the same everywhere.
 */
export const ConfirmPopover: FunctionComponent<Props> = ({ children, confirmLabel, message, onConfirm }) => {
  const translate = useTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const { context, floatingStyles, refs } = useFloating({
    middleware: [offset(GAP), flip(), shift({ padding: PADDING })],
    onOpenChange: setIsOpen,
    open: isOpen,
    placement: 'bottom',
    strategy: 'fixed',
  });
  const { getFloatingProps, getReferenceProps } = useInteractions([
    useClick(context),
    // Escape and an outside click both cancel, which is what a reader expects
    // of something that asks a question.
    useDismiss(context),
    useRole(context, { role: 'dialog' }),
  ]);

  const handleConfirm = (): void => {
    setIsOpen(false);
    onConfirm();
  };

  return (
    <>
      {cloneElement(children, getReferenceProps({ ref: refs.setReference, ...children.props }))}

      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div className={styles.popover} ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
              <p className={styles.message}>{message}</p>

              <div className={styles.actions}>
                <Button aria-label={translate('common.cancel')} onClick={() => setIsOpen(false)}>
                  {translate('common.cancel')}
                </Button>

                <Button aria-label={confirmLabel} variant="primary" onClick={handleConfirm}>
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
};
