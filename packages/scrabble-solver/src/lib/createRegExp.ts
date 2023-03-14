const createRegExp = (input: string): RegExp => {
  if (input.trim().length === 0) {
    return /.*/;
  }

  try {
    return new RegExp(input, 'gi');
  } catch {
    return /.*/;
  }
};

export default createRegExp;
