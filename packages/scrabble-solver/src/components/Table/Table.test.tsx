/* eslint-disable max-lines */

import { Locale } from '@scrabble-solver/types';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import { noop } from '../../lib/noop';
import { settingsInitialState } from '../../state/settings';
import { renderWithStore } from '../../test/render';
import { type Sort, SortDirection } from '../../types';

import { Cell, Header, HeaderButton, Row, Search } from '.';

describe('Header', () => {
  it('renders its children', () => {
    renderWithStore(<Header>content</Header>);

    expect(screen.getByText('content').className).toContain('header');
  });
});

describe('HeaderButton', () => {
  const sort: Sort<'a' | 'b'> = { column: 'a', direction: SortDirection.Ascending };

  function setup(props: Partial<Parameters<typeof HeaderButton<'a' | 'b'>>[0]> = {}) {
    const onSort = mock<(id: 'a' | 'b') => void>();

    renderWithStore(<HeaderButton id="a" sort={sort} translationKey="common.word" onSort={onSort} {...props} />);

    return { button: screen.getByRole('button', { name: 'Word' }), onSort };
  }

  it('sorts by its own id on click', () => {
    const { button, onSort } = setup({ id: 'b' });

    fireEvent.click(button);

    expect(onSort).toHaveBeenCalledWith('b');
  });

  it('shows the label without an icon and hides it with one', () => {
    function Icon() {
      return <svg data-testid="column-icon" />;
    }

    const { button } = setup({ Icon });

    expect(screen.getByTestId('column-icon')).toBeDefined();
    expect(button.querySelector('.headerButtonLabel')).toBeNull();
  });

  it('shows the label text when there is no icon', () => {
    const { button } = setup();

    expect(button.querySelector('.headerButtonLabel')?.textContent).toBe('Word');
  });

  it('shows an up arrow when ascending', () => {
    const { button } = setup();

    expect(button.querySelector('[data-icon="SortUp.svg"]')).not.toBeNull();
    expect(button.querySelector('[data-icon="SortDown.svg"]')).toBeNull();
  });

  it('shows a down arrow when descending', () => {
    const { button } = setup({ sort: { ...sort, direction: SortDirection.Descending } });

    expect(button.querySelector('[data-icon="SortDown.svg"]')).not.toBeNull();
  });

  it('shows no arrow on inactive columns', () => {
    const { button } = setup({ id: 'b' });

    expect(button.querySelector('.sortIcon')).toBeNull();
  });

  it('takes the leftover width when primary', () => {
    const { button } = setup({ primary: true });

    expect(button.className).toContain('primary');
  });
});

describe('Cell', () => {
  it('formats a number for the locale', () => {
    renderWithStore(<Cell data-testid="cell" value={1234} />, {
      state: { settings: { ...settingsInitialState, locale: Locale.FA_IR } },
    });

    expect(screen.getByTestId('cell').textContent).toBe((1234).toLocaleString(Locale.FA_IR));
  });

  it('prefers children over the value', () => {
    renderWithStore(
      <Cell data-testid="cell" value="value">
        child
      </Cell>,
    );

    expect(screen.getByTestId('cell').textContent).toBe('child');
  });

  it('marks the primary cell', () => {
    renderWithStore(<Cell data-testid="cell" primary value={1} />);

    expect(screen.getByTestId('cell').className).toContain('primary');
  });
});

describe('Row', () => {
  it('advertises a click only when it has a handler', () => {
    const { rerender } = renderWithStore(
      <Row aria-label="row" highlighted={false} inactive={false}>
        x
      </Row>,
    );

    expect(screen.getByLabelText('row').className).not.toContain('clickable');

    rerender(
      <Row aria-label="row" highlighted={false} inactive={false} onClick={noop}>
        x
      </Row>,
    );

    expect(screen.getByLabelText('row').className).toContain('clickable');
  });

  it('exposes the picked row', () => {
    renderWithStore(
      <Row aria-label="row" highlighted inactive={false}>
        x
      </Row>,
    );

    const row = screen.getByLabelText('row');

    expect(row.getAttribute('aria-current')).toBe('true');
    expect(row.className).toContain('highlighted');
  });

  it('is not current when not picked', () => {
    renderWithStore(
      <Row aria-label="row" highlighted={false} inactive={false}>
        x
      </Row>,
    );

    expect(screen.getByLabelText('row').getAttribute('aria-current')).toBeNull();
  });

  it('hides a dimmed row from assistive technology', () => {
    const { container } = renderWithStore(
      <Row aria-label="row" highlighted={false} inactive>
        x
      </Row>,
    );

    expect(container.querySelector('button')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('calls its handlers', () => {
    const handlers = {
      onBlur: mock(),
      onClick: mock(),
      onFocus: mock(),
      onMouseEnter: mock(),
    };

    renderWithStore(
      <Row aria-label="row" highlighted={false} inactive={false} {...handlers}>
        x
      </Row>,
    );

    const row = screen.getByLabelText('row');

    fireEvent.focus(row);
    fireEvent.blur(row);
    fireEvent.mouseEnter(row);
    fireEvent.click(row);

    for (const handler of Object.values(handlers)) {
      expect(handler).toHaveBeenCalledTimes(1);
    }
  });
});

describe('Search', () => {
  it('follows the value prop, so the input empties when the store resets the query', () => {
    const { rerender } = renderWithStore(<Search placeholder="Find" value="ca" onChange={noop} />);

    rerender(<Search placeholder="Find" value="" onChange={noop} />);

    expect((screen.getByPlaceholderText('Find') as HTMLInputElement).value).toBe('');
  });

  it('keeps an invalid expression being typed while the value prop stays the same', () => {
    renderWithStore(<Search placeholder="Find" value="ca" onChange={noop} />);
    const input = screen.getByPlaceholderText('Find') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'ca[' } });

    expect(input.value).toBe('ca[');
  });

  it('shows the value and placeholder', () => {
    renderWithStore(<Search placeholder="Find" value="abc" onChange={noop} />);

    expect((screen.getByPlaceholderText('Find') as HTMLInputElement).value).toBe('abc');
  });

  it('reports valid expressions', () => {
    const onChange = mock<(value: string) => void>();

    renderWithStore(<Search placeholder="Find" value="" onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText('Find'), { target: { value: 'a.*' } });

    expect(onChange).toHaveBeenCalledWith('a.*');
  });

  it('keeps showing what was typed but does not report an invalid expression', () => {
    const onChange = mock<(value: string) => void>();

    renderWithStore(<Search placeholder="Find" value="" onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText('Find'), { target: { value: '(' } });

    expect((screen.getByPlaceholderText('Find') as HTMLInputElement).value).toBe('(');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not reload the page on submit', () => {
    renderWithStore(<Search placeholder="Find" value="" onChange={noop} />);

    expect(fireEvent.submit(screen.getByPlaceholderText('Find').closest('form')!)).toBe(false);
  });
});
