import { RootState } from '../types';

export const selectBoard = (state: RootState) => state.board;

export const selectCellFilters = (state: RootState) => state.cellFilters;

export const selectDictionary = (state: RootState) => state.dictionary;

export const selectRack = (state: RootState) => state.rack;

export const selectResults = (state: RootState) => state.results;

export const selectSettings = (state: RootState) => state.settings;

export const selectSolve = (state: RootState) => state.solve;

export const selectVerify = (state: RootState) => state.verify;
