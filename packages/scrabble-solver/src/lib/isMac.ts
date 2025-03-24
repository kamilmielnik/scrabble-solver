export const isMac = (): boolean => {
  if (!globalThis.navigator) {
    return false;
  }

  return globalThis.navigator.platform.toLowerCase().includes('mac');
};
