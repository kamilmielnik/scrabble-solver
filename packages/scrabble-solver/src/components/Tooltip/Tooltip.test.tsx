import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import { createRef, forwardRef } from 'react';

import { noop } from '../../lib/noop';
import { flushEffects, flushTimers } from '../../test/async';
import { setLayout } from '../../test/media';

import { TooltipContext, useTooltipContext } from './context';
import { Tooltip } from './Tooltip';
import { TooltipTrigger } from './TooltipTrigger';

describe('Tooltip', () => {
  it('renders the bare child with no tooltip', () => {
    render(
      <Tooltip>
        <button type="button">Target</button>
      </Tooltip>,
    );

    expect(screen.getByRole('button').getAttribute('data-state')).toBeNull();
  });

  it('renders the bare child until one task past hydration', async () => {
    await setup();

    expect(screen.getByRole('button').getAttribute('data-state')).toBe('closed');
  });

  it('never attaches on touch devices', async () => {
    setLayout({ isCompact: true, isTouch: true });
    await setup();

    expect(screen.getByRole('button').getAttribute('data-state')).toBeNull();
  });

  it('shows the text on hover and hides it on Escape', async () => {
    await setup();

    fireEvent.mouseEnter(screen.getByRole('button'));
    await flushEffects();

    expect(screen.getByRole('tooltip').textContent).toContain('Hint');
    expect(screen.getByRole('button').getAttribute('data-state')).toBe('open');

    fireEvent.keyDown(document.body, { key: 'Escape' });
    await flushEffects();

    expect(screen.getByRole('button').getAttribute('data-state')).toBe('closed');
  });

  it('keeps the props of the child', async () => {
    await setup({ title: 'Own title' });

    expect(screen.getByRole('button').getAttribute('title')).toBe('Own title');
  });

  it('merges the child ref', async () => {
    const ref = createRef<HTMLButtonElement>();

    await setup({ ref });

    expect(ref.current).toBe(screen.getByRole('button') as HTMLButtonElement);
  });
});

describe('TooltipTrigger', () => {
  it('rejects a child that is not an element', () => {
    const value = { getReferenceProps: () => ({}), open: false, refs: { setReference: noop } };
    const Trigger = forwardRef((_, ref) => {
      return (
        <TooltipContext.Provider value={value as never}>
          <TooltipTrigger ref={ref as never}>{{ props: {} } as never}</TooltipTrigger>
        </TooltipContext.Provider>
      );
    });

    expect(() => render(<Trigger />)).toThrow("TooltipTrigger's children are not a valid element");
  });
});

describe('TooltipTrigger with a text child', () => {
  it.todo('reports that its children are not a valid element instead of crashing on children.props');
});

describe('useTooltipContext', () => {
  it('refuses to work outside a tooltip', () => {
    function Orphan() {
      useTooltipContext();
      return null;
    }

    expect(() => render(<Orphan />)).toThrow('Tooltip components must be wrapped in <Tooltip />');
  });
});

async function setup(props: Record<string, unknown> = {}) {
  render(
    <Tooltip tooltip="Hint">
      <button type="button" {...props}>
        Target
      </button>
    </Tooltip>,
  );

  await flushTimers();
}
