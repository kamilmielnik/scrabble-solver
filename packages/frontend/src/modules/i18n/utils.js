export const formatMessage = (message = '', values = {}) =>
  Object.keys(values).reduce((formatted, key) => {
    const replace = new RegExp(`{${key}}`, 'g');
    const replacement = values[key];

    return formatted.replace(replace, replacement);
  }, message);
