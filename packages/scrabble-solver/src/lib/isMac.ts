export const isMac = (): boolean => {
  if (!globalThis.navigator) {
    return false;
  }

  return globalThis.navigator.platform.startsWith('Mac') || globalThis.navigator.platform.startsWith('iPhone');
};
