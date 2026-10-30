/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Locale } from '@scrabble-solver/types';
import { act, render, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, jest, mock, spyOn } from 'bun:test';
import { type EffectCallback, Profiler } from 'react';
import { renderToString } from 'react-dom/server';

import { appInitialState } from '../state/app';
import { boardSlice } from '../state/board';
import { localStorage } from '../state/localStorage';
import { rackSlice } from '../state/rack';
import { settingsInitialState, settingsSlice } from '../state/settings';
import { flushTimers } from '../test/async';
import { setViewport } from '../test/media';
import { renderHookWithStore } from '../test/render';
import { ResultColumnId } from '../types';

import { useColumns } from './useColumns';
import { useDeferredRender } from './useDeferredRender';
import { useDirection } from './useDirection';
import { useEffectOnce } from './useEffectOnce';
import { useIsTouchDevice } from './useIsTouchDevice';
import { useLanguage } from './useLanguage';
import { useLatest } from './useLatest';
import { useLocalStorage } from './useLocalStorage';
import { useMedia } from './useMedia';
import { useMediaQueries } from './useMediaQueries';
import { useMediaQuery } from './useMediaQuery';

describe('useLatest', () => {
  it('always holds the latest value in one stable ref', () => {
    const { rerender, result } = renderHook(({ value }) => useLatest(value), { initialProps: { value: 1 } });
    const ref = result.current;

    rerender({ value: 2 });

    expect(result.current).toBe(ref);
    expect(ref.current).toBe(2);
  });
});

describe('useEffectOnce', () => {
  it('runs on mount only, with the first effect', () => {
    const effect = mock();
    const { rerender } = renderHook(({ fn }: { fn: EffectCallback }) => useEffectOnce(fn), {
      initialProps: { fn: effect },
    });

    rerender({ fn: mock() });

    expect(effect).toHaveBeenCalledTimes(1);
  });
});

describe('useDeferredRender', () => {
  it('is false for the first render and true one task later', async () => {
    const { result } = renderHook(() => useDeferredRender());

    expect(result.current).toBe(false);

    await flushTimers();

    expect(result.current).toBe(true);
  });

  it('cancels when unmounted first', () => {
    const clearTimeout = spyOn(window, 'clearTimeout');
    const { unmount } = renderHook(() => useDeferredRender());

    unmount();

    expect(clearTimeout).toHaveBeenCalledTimes(1);
    clearTimeout.mockRestore();
  });
});

describe('useDirection', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('dir');
  });

  it('applies the direction to the html element and restores it on unmount', () => {
    document.documentElement.dir = 'ltr';

    const { unmount } = renderHook(() => useDirection('rtl'));

    expect(document.documentElement.dir).toBe('rtl');
    unmount();
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('does not write the same value again', () => {
    document.documentElement.dir = 'rtl';
    const writes = trackAttribute('dir');

    renderHook(() => useDirection('rtl'));

    expect(writes.count()).toBe(0);
    writes.stop();
  });
});

describe('useLanguage', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('lang');
  });

  it('applies the language to the html element and restores it on unmount', () => {
    document.documentElement.lang = 'en-US';

    const { unmount } = renderHook(() => useLanguage('pl-PL'));

    expect(document.documentElement.lang).toBe('pl-PL');
    unmount();
    expect(document.documentElement.lang).toBe('en-US');
  });

  it('does not write the same value again', () => {
    document.documentElement.lang = 'pl-PL';
    const writes = trackAttribute('lang');

    renderHook(() => useLanguage('pl-PL'));

    expect(writes.count()).toBe(0);
    writes.stop();
  });
});

describe('useMedia', () => {
  it('reports the current match and follows changes', () => {
    const { result } = renderHook(() => useMedia('(max-width: 500px)'));

    expect(result.current).toBe(false);

    act(() => {
      setViewport({ width: 400 });
    });

    expect(result.current).toBe(true);
  });

  it('stops listening after unmount', () => {
    const list = window.matchMedia('(max-width: 501px)');
    const remove = jest.spyOn(list, 'removeEventListener');
    const { unmount } = renderHook(() => useMedia('(max-width: 501px)'));

    unmount();

    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('uses the default state for the server render', () => {
    function Probe() {
      return <span>{String(useMedia('(max-width: 502px)', true))}</span>;
    }

    expect(renderToString(<Probe />)).toContain('true');
  });
});

describe('useMediaQuery', () => {
  it('reads the breakpoint boundary as the app does: 1199px is compact, 1200px is not', () => {
    setViewport({ width: 1199 });
    expect(renderHook(() => useMediaQuery('<l')).result.current).toBe(true);

    setViewport({ width: 1200 });
    expect(renderHook(() => useMediaQuery('<l')).result.current).toBe(false);
  });

  it('accepts >= queries', () => {
    setViewport({ width: 1200 });

    expect(renderHook(() => useMediaQuery('>=l')).result.current).toBe(true);
  });
});

describe('useMediaQueries', () => {
  it('reports each breakpoint', () => {
    setViewport({ width: 700 });

    expect(renderHook(() => useMediaQueries()).result.current).toEqual({
      isLessThanL: true,
      isLessThanM: true,
      isLessThanS: true,
      isLessThanXl: true,
      isLessThanXs: false,
    });
  });
});

describe('useIsTouchDevice', () => {
  it('follows hover capability', () => {
    setViewport({ isTouch: true });

    expect(renderHook(() => useIsTouchDevice()).result.current).toBe(true);
  });
});

describe('useColumns', () => {
  it('shows every column on a wide screen', () => {
    const { result } = renderHookWithStore(() => useColumns());

    expect(Object.keys(result.current).sort()).toEqual(Object.values(ResultColumnId).sort());
  });

  it('removes vowels and consonants for locales without them', () => {
    const { result } = renderHookWithStore(() => useColumns(), {
      state: { settings: { ...settingsInitialState, locale: Locale.FA_IR } },
    });

    expect(result.current[ResultColumnId.VowelsCount]).toBeUndefined();
    expect(result.current[ResultColumnId.ConsonantsCount]).toBeUndefined();
    expect(result.current[ResultColumnId.Word]).toBe(true);
  });

  it.each([
    [1100, 3],
    [900, 3],
    [700, 5],
    [400, 3],
  ])('shows the columns that fit at %dpx', (width, count) => {
    setViewport({ width });

    const { result } = renderHookWithStore(() => useColumns());

    expect(Object.keys(result.current)).toHaveLength(count);
  });
});

describe('useLocalStorage', () => {
  it('writes nothing before hydration', () => {
    const { store } = renderHookWithStore(() => useLocalStorage());

    act(() => {
      store.dispatch(rackSlice.actions.changeCharacter({ character: 'a', index: 0 }));
    });

    expect(window.localStorage.length).toBe(0);
  });

  it('skips echoing back what hydration just read', () => {
    renderHookWithStore(() => useLocalStorage(), { state: { app: { ...appInitialState, isHydrated: true } } });

    expect(window.localStorage.length).toBe(0);
  });

  it('persists each slice once it changes after hydration', () => {
    const { store } = renderHookWithStore(() => useLocalStorage(), {
      state: { app: { ...appInitialState, isHydrated: true } },
    });

    act(() => {
      store.dispatch(boardSlice.actions.changeCellValue({ value: 'a', x: 0, y: 0 }));
      store.dispatch(rackSlice.actions.changeCharacter({ character: 'b', index: 0 }));
      store.dispatch(settingsSlice.actions.changeShowCoordinates('alternative'));
    });

    expect(localStorage.getBoard()?.rows[0][0].tile.character).toBe('a');
    expect(localStorage.getRack()?.[0]).toBe('b');
    expect(localStorage.getSettings().showCoordinates).toBe('alternative');
  });

  it('persists any new settings field without extra save code', () => {
    const { store } = renderHookWithStore(() => useLocalStorage(), {
      state: { app: { ...appInitialState, isHydrated: true } },
    });

    act(() => {
      store.dispatch(settingsSlice.actions.init({ extraField: 1 } as never));
    });

    expect(localStorage.getSettings()).toMatchObject({ extraField: 1 });
  });

  it('keeps writing after the first write', () => {
    const { store } = renderHookWithStore(() => useLocalStorage(), {
      state: { app: { ...appInitialState, isHydrated: true } },
    });

    act(() => {
      store.dispatch(rackSlice.actions.changeCharacter({ character: 'a', index: 0 }));
    });
    act(() => {
      store.dispatch(rackSlice.actions.changeCharacter({ character: 'b', index: 0 }));
    });

    expect(localStorage.getRack()?.[0]).toBe('b');
  });
});

describe('render-safe usage', () => {
  it('re-renders only when the media query result changes', () => {
    const onRender = mock();

    function Probe() {
      useMedia('(max-width: 503px)');

      return null;
    }

    render(
      <Profiler id="probe" onRender={onRender}>
        <Probe />
      </Profiler>,
    );

    act(() => {
      setViewport({ width: 1300 });
    });

    expect(onRender).toHaveBeenCalledTimes(1);
  });
});

function trackAttribute(name: string) {
  let count = 0;
  const observer = new MutationObserver((records) => {
    count += records.length;
  });

  observer.observe(document.documentElement, { attributeFilter: [name], attributes: true });

  return {
    count: () => count + observer.takeRecords().length,
    stop: () => observer.disconnect(),
  };
}
