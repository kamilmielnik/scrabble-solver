export const isMac = (): boolean => {
  if (!globalThis.navigator) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  return globalThis.navigator.platform.startsWith('Mac') || globalThis.navigator.platform === 'iPhone';
};
