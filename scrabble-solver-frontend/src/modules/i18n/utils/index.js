export const formatMessage = (message = '', values = {}) => Object.keys(values).reduce(
  (formatted, key) => formatted.replace(new RegExp(`{${key}}`, 'g'), values[key]),
  message
);
