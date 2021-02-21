import { RootState } from '../types';

export const selectBoardRoot = (state: RootState): RootState['board'] => state.board;

export const selectDictionaryRoot = (state: RootState): RootState['dictionary'] => state.dictionary;

export const selectRackRoot = (state: RootState): RootState['rack'] => state.rack;

export const selectResultsRoot = (state: RootState): RootState['results'] => state.results;

export const selectSettingsRoot = (state: RootState): RootState['settings'] => state.settings;

export const selectSolveRoot = (state: RootState): RootState['solve'] => state.solve;
