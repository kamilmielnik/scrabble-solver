const isRegExp = (value: string): boolean => {
  try {
    // eslint-disable-next-line no-new
    new RegExp(value, 'u');
    return true;
  } catch {
    return false;
  }
};

export default isRegExp;
