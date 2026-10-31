import { act, fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, jest, mock } from 'bun:test';
import { type ComponentProps } from 'react';

import { noop } from '../../lib/noop';
import { flushTimers } from '../../test/async';
import { renderWithStore } from '../../test/render';

import { Modal } from '.';

describe('Modal', () => {
  it('shows nothing while closed', () => {
    setup({ isOpen: false });

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows title and content in an accessible dialog', () => {
    setup();

    const dialog = screen.getByRole('dialog', { name: 'Title' });

    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Title');
    expect(screen.getByText('Content')).toBeDefined();
  });

  it('renders the footer only when given one', () => {
    setup({ footer: <span>Footer</span> });

    expect(screen.getByText('Footer').parentElement?.className).toContain('footer');
  });

  it('has no footer element by default', () => {
    setup();

    expect(document.querySelector('.footer')).toBeNull();
  });

  it('closes with the close button', () => {
    const onClose = mock();

    setup({ onClose });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape after the current event, without returning focus to the trigger', async () => {
    const onClose = mock();

    setup({ onClose });
    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(0);

    await flushTimers();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * #129 - Esc does not close the sidebar when letters input is focused
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/129
   */
  it('closes on Escape while focus is outside the modal (#129)', async () => {
    const onClose = mock();
    const outsideInput = document.body.appendChild(document.createElement('input'));

    setup({ onClose });
    fireEvent.keyDown(outsideInput, { key: 'Escape' });
    await flushTimers();
    outsideInput.remove();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignores other keys', async () => {
    const onClose = mock();

    setup({ onClose });
    fireEvent.keyDown(document.body, { key: 'a' });

    await flushTimers();

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it('stops listening for Escape after unmounting', async () => {
    const onClose = mock();
    const { unmount } = setup({ onClose });

    unmount();
    fireEvent.keyDown(document.body, { key: 'Escape' });

    await flushTimers();

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it('applies class names to the content and the frame', () => {
    setup({ className: 'content-class', modalClassName: 'frame-class' });

    expect(document.querySelector('.container')?.className).toContain('content-class');
    expect(screen.getByRole('dialog').className).toContain('frame-class');
  });

  it('keeps the content mounted during the closing transition', () => {
    jest.useFakeTimers();

    const { rerender } = setup();

    rerender(createModal({ isOpen: false }));

    expect(screen.getByRole('dialog')).toBeDefined();

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(screen.queryByRole('dialog')).toBeNull();
    jest.useRealTimers();
  });
});

describe('Modal.Section', () => {
  it('labels the section and renders its title and content', () => {
    renderWithStore(
      <Modal.Section label="Label" title="Heading">
        Body
      </Modal.Section>,
    );

    expect(screen.getByRole('region', { name: 'Label' }).textContent).toBe('HeadingBody');
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Heading');
  });
});

function createModal(props: Partial<ComponentProps<typeof Modal>> = {}) {
  return (
    <Modal isOpen title="Title" onClose={noop} {...props}>
      Content
    </Modal>
  );
}

function setup(props: Partial<ComponentProps<typeof Modal>> = {}) {
  return renderWithStore(createModal(props));
}
