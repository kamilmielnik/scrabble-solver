export function waitForIdleOrFirstIntent(): Promise<void> {
  return new Promise((resolve) => {
    const settle = () => {
      window.removeEventListener('pointerdown', settle);
      window.removeEventListener('keydown', settle);
      resolve();
    };

    window.addEventListener('pointerdown', settle, { once: true });
    window.addEventListener('keydown', settle, { once: true });
    whenIdle(settle);
  });
}

function whenIdle(callback: () => void): void {
  const requestIdle = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: 5000 });
    } else {
      setTimeout(callback, 5000);
    }
  };

  if (document.readyState === 'complete') {
    requestIdle();
  } else {
    window.addEventListener('load', requestIdle, { once: true });
  }
}
