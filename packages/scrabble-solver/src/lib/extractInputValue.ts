export const extractInputValue = (input: HTMLInputElement) => {
  const value = input.value.toLocaleLowerCase();

  if (input.selectionStart === null || input.selectionEnd === null) {
    return value;
  }

  const index = Math.min(input.selectionStart, input.selectionEnd);

  if (index > 0) {
    return value.substring(index - 1, index);
  }

  return value;
};
