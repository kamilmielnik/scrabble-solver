const DESKTOP_WIDTH = 1280;
const COMPACT_WIDTH = 800;

interface Viewport {
  isTouch: boolean;
  width: number;
}

interface StubMediaQueryList {
  addEventListener: (type: 'change', listener: () => void) => void;
  dispatchEvent: () => boolean;
  listeners: Set<() => void>;
  matches: boolean;
  media: string;
  removeEventListener: (type: 'change', listener: () => void) => void;
}

const viewport: Viewport = { isTouch: false, width: DESKTOP_WIDTH };
const mediaQueryLists = new Map<string, StubMediaQueryList>();

/**
 * `useMedia` caches MediaQueryList objects for the lifetime of the process, so a query has to keep answering from the
 * current viewport through the same object.
 */
export function installMatchMedia(): void {
  globalThis.matchMedia = stubMatchMedia as unknown as typeof globalThis.matchMedia;
  window.matchMedia = globalThis.matchMedia;
}

export function setViewport(next: Partial<Viewport>): void {
  Object.assign(viewport, next);

  for (const mediaQueryList of mediaQueryLists.values()) {
    for (const listener of mediaQueryList.listeners) {
      listener();
    }
  }
}

export function setLayout({ isCompact, isTouch = false }: { isCompact: boolean; isTouch?: boolean }): void {
  setViewport({ isTouch, width: isCompact ? COMPACT_WIDTH : DESKTOP_WIDTH });
}

export function resetViewport(): void {
  Object.assign(viewport, { isTouch: false, width: DESKTOP_WIDTH });
}

function stubMatchMedia(query: string): StubMediaQueryList {
  const existing = mediaQueryLists.get(query);

  if (existing) {
    return existing;
  }

  const listeners = new Set<() => void>();
  const mediaQueryList: StubMediaQueryList = {
    addEventListener: (_, listener) => {
      listeners.add(listener);
    },
    dispatchEvent: () => true,
    listeners,
    get matches() {
      return evaluateQuery(query);
    },
    media: query,
    removeEventListener: (_, listener) => {
      listeners.delete(listener);
    },
  };

  mediaQueryLists.set(query, mediaQueryList);
  return mediaQueryList;
}

function evaluateQuery(query: string): boolean {
  if (query === '(hover: none)') {
    return viewport.isTouch;
  }

  const maxWidth = /max-width:\s*(\d+)px/.exec(query);
  const minWidth = /min-width:\s*(\d+)px/.exec(query);

  return (!maxWidth || viewport.width <= Number(maxWidth[1])) && (!minWidth || viewport.width >= Number(minWidth[1]));
}
