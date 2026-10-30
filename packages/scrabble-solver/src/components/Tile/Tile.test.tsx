import { Locale } from '@scrabble-solver/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';
import { type ComponentProps, createRef } from 'react';

import { noop } from '../../lib/noop';

import { Tile } from './Tile';

describe('Tile', () => {
  it('shows the character in the input and on the tile', () => {
    setup({ character: 'a' });

    expect(getInput().value).toBe('a');
    expect(getTile().textContent).toBe('a');
  });

  it('shows the placeholder only when empty', () => {
    setup({ placeholder: 'L' });

    expect(getTile().textContent).toBe('L');
    expect(getTile().className).toContain('empty');
  });

  it('prefers the character over the placeholder', () => {
    setup({ character: 'a', placeholder: 'L' });

    expect(getTile().textContent).toBe('a');
  });

  it('formats points for the locale', () => {
    setup({ character: 'a', locale: Locale.FA_IR, points: 10 });

    expect(getTile().querySelector('.points')?.textContent).toBe('۱۰');
  });

  it('hides points of an empty tile', () => {
    setup({ points: 1 });

    expect(getTile().querySelector('.points')).toBeNull();
  });

  it('shows the points of an empty blank tile', () => {
    setup({ isBlank: true, points: 0 });

    expect(getTile().querySelector('.points')?.textContent).toBe('0');
  });

  it('treats a space as empty', () => {
    setup({ character: ' ', points: 1 });

    expect(getTile().querySelector('.points')).toBeNull();
  });

  it('hides points when there is no score', () => {
    setup({ character: 'a' });

    expect(getTile().querySelector('.points')).toBeNull();
  });

  it.each([
    [1, 'points1'],
    [2, 'points2'],
    [3, 'points3'],
    [4, 'points4'],
    [5, 'points5'],
    [10, 'points5'],
  ])('styles %d points as %s', (points, className) => {
    setup({ character: 'a', points });

    expect(getTile().className).toContain(className);
  });

  it('exposes the highlight to assistive technology', () => {
    setup({ character: 'a', highlighted: true });

    expect(getTile().getAttribute('role')).toBe('mark');
  });

  it('warns about an invalid tile', () => {
    setup({ character: 'a', isValid: false });

    expect(getTile().className).toContain('invalid');
    expect(getTile().querySelector('[data-icon="ExclamationSquareFill.svg"]')).not.toBeNull();
  });

  it('shows no warning for a valid tile', () => {
    setup({ character: 'a', isValid: true });

    expect(getTile().querySelector('[data-icon="ExclamationSquareFill.svg"]')).toBeNull();
  });

  it('marks blank and raised tiles', () => {
    setup({ character: 'a', isBlank: true, raised: true });

    expect(getTile().className).toContain('blank');
    expect(getTile().className).toContain('raised');
  });

  it('renders no input when disabled', () => {
    render(<Tile aria-label="tile" character="a" disabled locale={Locale.EN_US} />);

    expect(screen.queryByLabelText('tile')).toBeNull();
  });

  it('forwards the input ref', () => {
    const inputRef = createRef<HTMLInputElement>();

    setup({ inputRef });

    expect(inputRef.current).toBe(getInput());
  });

  it('selects the content before reporting a key press, so typing replaces the tile', () => {
    const onKeyDown = mock();

    setup({ character: 'a', onKeyDown });
    fireEvent.keyDown(getInput(), { key: 'b' });

    expect(getInput().selectionStart).toBe(0);
    expect(getInput().selectionEnd).toBe(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('passes focus, mouse, touch and change events on', () => {
    const handlers = {
      onChange: mock(),
      onFocus: mock(),
      onMouseDown: mock(),
      onTouchStart: mock(),
    };

    setup(handlers);
    fireEvent.focus(getInput());
    fireEvent.mouseDown(getInput());
    fireEvent.touchStart(getInput());
    fireEvent.change(getInput(), { target: { value: 'a' } });

    for (const handler of Object.values(handlers)) {
      expect(handler).toHaveBeenCalledTimes(1);
    }
  });
});

function setup(props: Partial<ComponentProps<typeof Tile>>) {
  return render(<Tile aria-label="tile" locale={Locale.EN_US} onChange={noop} {...props} />);
}

function getInput(): HTMLInputElement {
  return screen.getByLabelText('tile');
}

function getTile(): HTMLElement {
  return getInput().parentElement!;
}
