import { createSelector } from 'reselect';

export const selectDictionary = (state) => state.dictionary;
export const selectInput = createSelector(selectDictionary, ({ input }) => input);
export const selectIsLoading = createSelector(selectDictionary, ({ isLoading }) => isLoading);
export const selectIsAllowed = createSelector(selectDictionary, ({ isAllowed }) => isAllowed);
export const selectDefinitions = createSelector(selectDictionary, ({ definitions }) => definitions);
export const selectDefinitionsWord = createSelector(selectDictionary, ({ word }) => word);
