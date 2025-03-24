export const findFirstWordIndex = (lines: string[], locale: string): number => {
  const firstWordIndex = lines.findIndex((line, index) => {
    const nextLine = line[index + 1] || '';
    const isNextLineInOrder = line.localeCompare(nextLine, locale) > 0;
    const hasWhitespace = Boolean(line.match(/\s/));
    const isEmpty = line.trim().length === 0;

    return !isEmpty && !hasWhitespace && isNextLineInOrder;
  });

  if (typeof firstWordIndex === 'undefined') {
    throw new Error('Cannot find index of the first word in the file');
  }

  return firstWordIndex;
};
