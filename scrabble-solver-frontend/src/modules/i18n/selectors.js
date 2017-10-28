import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { formatMessage } from 'i18n/utils';

const selectRoot = (state) => state.i18n;
export const selectLocale = createSelector(selectRoot, ({ locale }) => locale);
export const selectMessages = createSelector(selectRoot, ({ messages }) => messages);
export const selectMessage = createCachedSelector(
  [ selectMessages, (state, { id, values }) => ({ id, values }) ],
  (messages, { id, values }) => formatMessage(messages[id], values)
)((state, { id, values } = {}) => `${id}-${JSON.stringify(values)}`);
