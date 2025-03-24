export const isRegExp = (value: string): boolean => {
  try {
    // eslint-disable-next-line no-new
    new RegExp(value);
    return true;
  } catch {
    return false;
  }
};
