const createRegExp = (input: string): RegExp => {
  if (input.trim().length === 0) {
    return /.*/u;
  }

  try {
    return new RegExp(input, 'giu');
  } catch {
    return /.*/u;
  }
};

export default createRegExp;
