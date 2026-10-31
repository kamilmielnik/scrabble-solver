/* eslint-disable max-lines */

import { Locale } from '@scrabble-solver/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';

import english from '../i18n/languages/english.json';
import { noop } from '../lib/noop';
import { COLOR_BLUE, COLOR_GREEN, COLOR_RED, COLOR_YELLOW, PLAIN_TILES_COLOR_DEFAULT } from '../parameters';
import { settingsInitialState } from '../state/settings';
import { renderWithStore } from '../test/render';

import { Alert } from './Alert';
import { Badge } from './Badge';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { IconButton } from './IconButton';
import { Key } from './Key';
import { Arrows, Backspace, Ctrl, Del, Enter, Space } from './Keys';
import { Loading } from './Loading';
import { LogoBlueprint } from './Logo/LogoBlueprint';
import { NotFound } from './NotFound';
import { PlainTiles } from './PlainTiles';
import { createPlainTile, createPlainTiles, getViewbox } from './PlainTiles/lib';
import { Progress } from './Progress';
import { Radio } from './Radio';
import { Spinner } from './Spinner';

const persian = { settings: { ...settingsInitialState, locale: Locale.FA_IR } };
const turkish = { settings: { ...settingsInitialState, locale: Locale.TR_TR } };
const Icon = () => <svg data-testid="icon" />;

describe('Alert', () => {
  it.each([
    ['error', 'CrossCircleFill.svg'],
    ['info', 'InfoCircleFill.svg'],
    ['success', 'Check.svg'],
    ['warning', 'ExclamationTriangleFill.svg'],
  ] as const)('renders the %s variant with its icon', (variant, icon) => {
    render(
      <Alert data-testid="alert" variant={variant}>
        Message
      </Alert>,
    );

    const alert = screen.getByTestId('alert');

    expect(alert.className).toContain(variant);
    expect(alert.textContent).toBe('Message');
    expect(alert.querySelector(`[data-icon="${icon}"]`)).not.toBeNull();
  });
});

describe('Badge and Key', () => {
  it('render children with a class name', () => {
    render(
      <>
        <Badge className="custom">1 / 2</Badge>
        <Key className="custom">K</Key>
      </>,
    );

    expect(screen.getByText('1 / 2').className).toContain('badge');
    expect(screen.getByText('K').tagName).toBe('KBD');
  });
});

describe('Button', () => {
  it('is a plain, non-submitting default button', () => {
    render(<Button aria-label="Do">Label</Button>);

    const button = screen.getByRole('button', { name: 'Do' });

    expect(button.getAttribute('type')).toBe('button');
    expect(button.className).toContain('default');
    expect(button.textContent).toBe('Label');
  });

  it('can submit a form', () => {
    render(<Button aria-label="Do" type="submit" />);

    expect(screen.getByRole('button').getAttribute('type')).toBe('submit');
  });

  it('supports the primary and wide styles', () => {
    render(<Button aria-label="Do" variant="primary" wide />);

    const { className } = screen.getByRole('button');

    expect(className).toContain('primary');
    expect(className).toContain('wide');
    expect(className).not.toContain('default');
  });

  it('renders an icon, and no label element without children', () => {
    render(<Button aria-label="Do" Icon={Icon} />);

    expect(screen.getByTestId('icon')).toBeDefined();
    expect(document.querySelector('.label')).toBeNull();
  });

  it('calls onClick', () => {
    const onClick = mock();

    render(<Button aria-label="Do" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const onClick = mock();

    render(<Button aria-label="Do" disabled onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Button.Link', () => {
  it('renders a styled anchor', () => {
    render(
      <Button.Link aria-label="Go" href="/x" Icon={Icon} variant="primary" wide>
        Label
      </Button.Link>,
    );

    const link = screen.getByRole('link', { name: 'Go' });

    expect(link.getAttribute('href')).toBe('/x');
    expect(link.className).toContain('primary');
    expect(link.className).toContain('wide');
    expect(link.textContent).toBe('Label');
  });

  it('defaults to the default variant and omits an empty label', () => {
    render(<Button.Link aria-label="Go" href="/x" Icon={Icon} />);

    expect(screen.getByRole('link').className).toContain('default');
    expect(document.querySelector('.label')).toBeNull();
  });
});

describe('IconButton', () => {
  it('renders an icon button and calls onClick', () => {
    const onClick = mock();

    render(<IconButton aria-label="Do" Icon={Icon} tooltip="Do it" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Do' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button').getAttribute('type')).toBe('button');
  });

  it('renders a link variant', () => {
    render(<IconButton.Link aria-label="Go" href="/x" Icon={Icon} tooltip="Go there" />);

    expect(screen.getByRole('link', { name: 'Go' }).getAttribute('href')).toBe('/x');
    expect(screen.getByTestId('icon')).toBeDefined();
  });
});

describe('Keys', () => {
  it('renders each key', () => {
    renderWithStore(
      <>
        <Backspace />
        <Del />
        <Enter />
        <Space />
      </>,
    );

    expect(Array.from(document.querySelectorAll('kbd'), (key) => key.textContent?.trim())).toEqual([
      '← Backspace',
      'Del',
      'Enter ⏎',
      'Spacebar',
    ]);
  });

  it('renders Ctrl off a Mac', () => {
    render(<Ctrl />);

    expect(document.querySelector('kbd')?.textContent).toBe('Ctrl');
  });

  it('renders the command key on a Mac', () => {
    const platform = Object.getOwnPropertyDescriptor(navigator, 'platform');
    Object.defineProperty(navigator, 'platform', { configurable: true, value: 'MacIntel' });

    render(<Ctrl />);

    expect(document.querySelector('kbd')?.textContent).toBe('⌘');

    if (platform) {
      Object.defineProperty(navigator, 'platform', platform);
    } else {
      Reflect.deleteProperty(navigator, 'platform');
    }
  });

  it('renders the four arrows', () => {
    render(<Arrows />);

    expect(document.querySelectorAll('kbd')).toHaveLength(4);
    expect(document.querySelector('[data-icon="ArrowLeft.svg"]')).not.toBeNull();
    expect(document.querySelector('[data-icon="ArrowDown.svg"]')).not.toBeNull();
  });
});

describe('PlainTiles', () => {
  it('lays characters out in a row and skips one cell between words', () => {
    const tiles = createPlainTiles({ content: [['AB', 'C']] });

    expect(tiles.map(({ character, x }) => [character, x])).toEqual([
      ['A', 0],
      ['B', 86],
      ['C', 86 * 3],
    ]);
  });

  it('places rows below each other', () => {
    const tiles = createPlainTiles({ content: [['A'], ['B']] });

    expect(tiles[1].y).toBe(86);
  });

  it('shows points only on request', () => {
    expect(createPlainTile({ cellIndex: 0, character: 'A', rowIndex: 0 }).points).toBeUndefined();
    expect(createPlainTile({ cellIndex: 0, character: 'A', rowIndex: 0, showPoints: true }).points).toBe(1);
  });

  it('colors by points unless a color is given, with a default for unknown characters', () => {
    expect(createPlainTile({ cellIndex: 0, character: 'A', rowIndex: 0 }).color).toBe(COLOR_YELLOW);
    expect(createPlainTile({ cellIndex: 0, character: 'A', color: 'red', rowIndex: 0 }).color).toBe('red');
    expect(createPlainTile({ cellIndex: 0, character: '1', rowIndex: 0 }).color).toBe(PLAIN_TILES_COLOR_DEFAULT);
  });

  it('sizes the viewbox to the longest row', () => {
    expect(getViewbox([['AB', 'C'], ['D']])).toBe(`0 0 ${4 * 86 - 6} ${2 * 86 - 6}`);
  });

  it('has an empty viewbox for no content', () => {
    expect(getViewbox([])).toBe('0 0 0 0');
    expect(getViewbox([[]])).toBe('0 0 0 80');
  });

  it('renders one tile per character, with optional points and effects', () => {
    const { container } = render(
      <PlainTiles className="custom" content={[['AB']]} dropShadow showPoints style={{ top: 1 }} wave />,
    );
    const svg = container.querySelector('svg')!;

    expect(svg.querySelectorAll('rect')).toHaveLength(2);
    expect(svg.querySelectorAll('text')).toHaveLength(4);
    expect(svg.getAttribute('class')).toContain('dropShadow');
    expect(svg.getAttribute('class')).toContain('wave');
  });

  it('omits points text by default', () => {
    const { container } = render(<PlainTiles content={[['AB']]} />);

    expect(container.querySelectorAll('text')).toHaveLength(2);
  });
});

describe('EmptyState', () => {
  it('uppercases the title with the rules of the active locale, so Turkish i becomes dotted I', () => {
    const translations = { [Locale.TR_TR]: { ...english, 'empty-state.info': 'bilgi' } };
    const { container } = renderWithStore(<EmptyState variant="info">Message</EmptyState>, {
      state: { ...turkish, i18n: { translations } },
    });

    expect(readTiles(container)).toBe('BİLGİ');
  });

  it.each([
    ['error', COLOR_RED],
    ['info', COLOR_BLUE],
    ['success', COLOR_GREEN],
    ['warning', COLOR_YELLOW],
  ] as const)('spells the %s title in its color', (variant, color) => {
    const { container } = renderWithStore(<EmptyState variant={variant}>Message</EmptyState>);

    expect(screen.getByText('Message')).toBeDefined();
    expect(container.querySelector('rect')?.getAttribute('style')).toContain(color);
  });

  it('reverses the letters right-to-left, keeping graphemes whole', () => {
    const combiningAcute = '\u0301';
    const translations = { [Locale.FA_IR]: { ...english, 'empty-state.info': `ab${combiningAcute}c` } };
    const { container } = renderWithStore(<EmptyState variant="info">Message</EmptyState>, {
      state: { ...persian, i18n: { translations } },
    });
    const letters = Array.from(container.querySelectorAll('text'), (text) => text.textContent).join('');

    expect(letters).toBe(`CB${combiningAcute}A`);
  });
});

describe('Loading', () => {
  it('uppercases with the rules of the active locale, so Turkish i becomes dotted I', () => {
    const translations = { [Locale.TR_TR]: { ...english, 'common.loading': 'yükleniyor' } };
    const { container } = renderWithStore(<Loading />, { state: { ...turkish, i18n: { translations } } });

    expect(readTiles(container)).toBe('YÜKLENİYOR');
  });

  it('announces loading and spells it in tiles', () => {
    renderWithStore(<Loading />);

    const loading = screen.getByRole('status', { name: 'Loading' });
    const letters = Array.from(loading.querySelectorAll('text'), (text) => text.textContent).join('');

    expect(letters).toBe('LOADING');
    expect(loading.querySelector('svg')?.getAttribute('class')).toContain('wave');
  });

  it('can stay still', () => {
    renderWithStore(<Loading wave={false} />);

    expect(document.querySelector('svg')?.getAttribute('class')).not.toContain('wave');
  });

  it('reverses the tiles right-to-left', () => {
    renderWithStore(<Loading />, { state: persian });

    const loading = screen.getByTestId('loading');
    const letters = Array.from(loading.querySelectorAll('text'), (text) => text.textContent).join('');
    const label = loading.getAttribute('aria-label')!;

    expect(letters).toBe(label.split('').reverse().join('').toUpperCase());
  });
});

describe('Logo', () => {
  it('spells the app name in the blueprint', () => {
    const { container } = render(<LogoBlueprint className="custom" />);
    const letters = Array.from(container.querySelectorAll('text'), (text) => text.textContent).join('');

    expect(letters).toBe('SCRABBLESOLVER2');
  });
});

describe('NotFound', () => {
  it('links home and spells HTTP 404', () => {
    const { container } = render(<NotFound />);
    const letters = Array.from(container.querySelectorAll('text'), (text) => text.textContent).join('');

    expect(letters).toBe('HTTP404');
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/');
  });
});

describe('Progress', () => {
  it('exposes the value to assistive technology', () => {
    renderWithStore(<Progress max={4} value={1} />);

    const progress = screen.getByRole('progressbar');

    expect(progress.getAttribute('aria-valuemax')).toBe('4');
    expect(progress.getAttribute('aria-valuemin')).toBe('0');
    expect(progress.getAttribute('aria-valuenow')).toBe('1');
    expect(progress.getAttribute('aria-valuetext')).toBe('25%');
    expect(progress.getAttribute('title')).toBe('25%');
    expect(progress.style.getPropertyValue('--progress')).toBe('25%');
  });

  it('refuses a max of 0, which has no percentage', () => {
    expect(() => renderWithStore(<Progress max={0} value={-1} />)).toThrow('Progress needs a max other than 0');
  });

  it('shows negative values for overused tiles', () => {
    renderWithStore(<Progress max={2} value={-1} />);

    expect(screen.getByRole('progressbar').getAttribute('aria-valuetext')).toBe('-50%');
  });

  it('formats for the locale and keeps custom style', () => {
    renderWithStore(<Progress max={2} style={{ color: 'red' }} value={1} />, { state: persian });

    const progress = screen.getByRole('progressbar');

    expect(progress.getAttribute('title')).toBe(`${(50).toLocaleString(Locale.FA_IR)}%`);
    expect(progress.style.color).toBe('red');
  });
});

describe('Radio', () => {
  it('reports a change', () => {
    const onChange = mock();

    render(
      <Radio checked={false} name="group" value="a" onChange={onChange}>
        Option
      </Radio>,
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Option' }));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('reflects the checked and disabled states', () => {
    render(
      <Radio checked disabled name="group" value="a" onChange={noop}>
        Option
      </Radio>,
    );

    const radio = screen.getByRole('radio') as HTMLInputElement;
    const label = radio.closest('label');

    expect(radio.checked).toBe(true);
    expect(radio.disabled).toBe(true);
    expect(label?.className).toContain('checked');
    expect(label?.className).toContain('disabled');
  });
});

describe('Spinner', () => {
  it('announces loading', () => {
    renderWithStore(<Spinner className="custom" />);

    expect(screen.getByRole('status', { name: 'Loading' }).className).toContain('custom');
  });
});

function readTiles(container: HTMLElement): string {
  return Array.from(container.querySelectorAll('text'), (text) => text.textContent).join('');
}
