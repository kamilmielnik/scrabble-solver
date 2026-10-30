import { type KeyboardEvent } from 'react';

import { ResultColumnId, SortDirection } from '../types';

import { createKeyboardNavigation } from './createKeyboardNavigation';
import { createRegExp } from './createRegExp';
import { extractInputValue } from './extractInputValue';
import { getNextSort } from './getNextSort';
import { inverseDirection } from './inverseDirection';
import { isCtrl } from './isCtrl';
import { isMac } from './isMac';
import { isRegExp } from './isRegExp';
import { noop } from './noop';

describe('createKeyboardNavigation', () => {
  it.each([
    ['ArrowUp', 'onArrowUp'],
    ['ArrowDown', 'onArrowDown'],
    ['ArrowLeft', 'onArrowLeft'],
    ['ArrowRight', 'onArrowRight'],
    ['Backspace', 'onBackspace'],
    ['Delete', 'onDelete'],
    ['Enter', 'onEnter'],
    [' ', 'onSpace'],
  ])('routes %j to %s, then to onKeyDown', (key, handler) => {
    const calls: string[] = [];
    const event = { key } as KeyboardEvent<HTMLInputElement>;
    const handleKeyDown = createKeyboardNavigation({
      [handler]: () => calls.push(handler),
      onKeyDown: () => calls.push('onKeyDown'),
    });

    handleKeyDown(event);

    expect(calls).toEqual([handler, 'onKeyDown']);
  });

  it('calls only onKeyDown for other keys', () => {
    const calls: string[] = [];
    const handleKeyDown = createKeyboardNavigation({
      onEnter: () => calls.push('onEnter'),
      onKeyDown: () => calls.push('onKeyDown'),
    });

    handleKeyDown({ key: 'a' } as KeyboardEvent<HTMLInputElement>);

    expect(calls).toEqual(['onKeyDown']);
  });

  it('works with no handlers', () => {
    expect(() => {
      createKeyboardNavigation({})({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
    }).not.toThrow();
  });
});

describe('createRegExp', () => {
  it.each(['', '   '])('matches everything for the blank input %j', (input) => {
    expect(String(createRegExp(input))).toBe('/.*/');
  });

  it('builds a global, case-insensitive expression', () => {
    expect(createRegExp('c.t')).toEqual(/c.t/gi);
  });

  it('matches everything for an invalid expression', () => {
    expect(String(createRegExp('('))).toBe('/.*/');
  });
});

describe('extractInputValue', () => {
  it.todo('lowercases with the rules of the active locale, so Turkish I becomes dotless i');

  it('returns the character before the caret, lowercased', () => {
    expect(extractInputValue(createInput('aB', 2, 2))).toBe('b');
  });

  it('uses the start of a selection, whichever way it was made', () => {
    expect(extractInputValue(createInput('abc', 2, 3))).toBe('b');
    expect(extractInputValue(createInput('abc', 3, 2))).toBe('b');
  });

  it('returns the whole value with the caret at the start', () => {
    expect(extractInputValue(createInput('AB', 0, 0))).toBe('ab');
  });

  it('returns the whole value for inputs without a selection', () => {
    expect(extractInputValue(createInput('AB', null, null))).toBe('ab');
    expect(extractInputValue(createInput('AB', 1, null))).toBe('ab');
  });
});

describe('getNextSort', () => {
  it('toggles the direction when the column stays', () => {
    const descending = { column: ResultColumnId.Word, direction: SortDirection.Descending };
    const ascending = { column: ResultColumnId.Word, direction: SortDirection.Ascending };

    expect(getNextSort(descending, ResultColumnId.Word)).toEqual(ascending);
    expect(getNextSort(ascending, ResultColumnId.Word)).toEqual(descending);
  });

  it('keeps the direction when the column changes', () => {
    const sort = { column: ResultColumnId.Word, direction: SortDirection.Descending };

    expect(getNextSort(sort, ResultColumnId.Points)).toEqual({
      column: ResultColumnId.Points,
      direction: SortDirection.Descending,
    });
  });
});

describe('inverseDirection', () => {
  it('swaps left and right', () => {
    expect(inverseDirection('left')).toBe('right');
    expect(inverseDirection('right')).toBe('left');
  });
});

describe('isCtrl', () => {
  it('accepts ctrl and the Mac command key', () => {
    expect(isCtrl({ ctrlKey: true, metaKey: false } as KeyboardEvent)).toBe(true);
    expect(isCtrl({ ctrlKey: false, metaKey: true } as KeyboardEvent)).toBe(true);
    expect(isCtrl({ ctrlKey: false, metaKey: false } as KeyboardEvent)).toBe(false);
  });
});

describe('isMac', () => {
  it.each([
    ['MacIntel', true],
    ['iPhone', true],
    ['Win32', false],
    ['Linux x86_64', false],
  ])('for platform %s is %p', (platform, expected) => {
    withNavigator({ platform }, () => {
      expect(isMac()).toBe(expected);
    });
  });

  it('is false without a navigator (SSR)', () => {
    withNavigator(undefined, () => {
      expect(isMac()).toBe(false);
    });
  });
});

describe('isRegExp', () => {
  it('tells valid and invalid expressions apart', () => {
    expect(isRegExp('a.*')).toBe(true);
    expect(isRegExp('(')).toBe(false);
  });
});

describe('noop', () => {
  it('returns nothing', () => {
    expect(noop()).toBeUndefined();
  });
});

function createInput(value: string, selectionStart: number | null, selectionEnd: number | null) {
  return { selectionEnd, selectionStart, value } as HTMLInputElement;
}

function withNavigator(value: unknown, run: () => void): void {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')!;
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value, writable: true });

  try {
    run();
  } finally {
    Object.defineProperty(globalThis, 'navigator', descriptor);
  }
}
