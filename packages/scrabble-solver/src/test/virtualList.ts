type Size = { height: number; width: number };

type ResizeCallback = (entries: { contentRect: Size; target: Element }[]) => void;

const LIST_SIZE: Size = { height: 400, width: 400 };

const observedElements = new Map<Element, ResizeCallback>();

/**
 * react-window renders rows only for the height its ResizeObserver reports, and happy-dom has no layout to report.
 */
export function installFixedSizeResizeObserver(): void {
  window.ResizeObserver = FixedSizeResizeObserver as unknown as typeof ResizeObserver;
}

/**
 * Reports a new height of every observed list, as a browser does when `display: none` hides or shows it.
 */
export function resizeObservedLists(height: number): void {
  for (const [target, callback] of observedElements) {
    callback([{ contentRect: { ...LIST_SIZE, height }, target }]);
  }
}

class FixedSizeResizeObserver {
  private readonly callback: ResizeCallback;

  private readonly targets = new Set<Element>();

  constructor(callback: ResizeCallback) {
    this.callback = callback;
  }

  public disconnect(): void {
    for (const target of this.targets) {
      observedElements.delete(target);
    }

    this.targets.clear();
  }

  public observe(target: Element): void {
    this.targets.add(target);
    observedElements.set(target, this.callback);
    this.callback([{ contentRect: LIST_SIZE, target }]);
  }

  public unobserve(target: Element): void {
    this.targets.delete(target);
    observedElements.delete(target);
  }
}
