import { noop } from '../lib/noop';

const LIST_SIZE = { height: 400, width: 400 };

type ResizeCallback = (entries: { contentRect: typeof LIST_SIZE; target: Element }[]) => void;

/**
 * react-window renders rows only for the height its ResizeObserver reports, and happy-dom has no layout to report.
 */
export function installFixedSizeResizeObserver(): void {
  window.ResizeObserver = FixedSizeResizeObserver as unknown as typeof ResizeObserver;
}

class FixedSizeResizeObserver {
  private readonly callback: ResizeCallback;

  constructor(callback: ResizeCallback) {
    this.callback = callback;
  }

  public disconnect = noop;

  public observe(target: Element): void {
    this.callback([{ contentRect: LIST_SIZE, target }]);
  }

  public unobserve = noop;
}
