import {
  boardSlice,
  cellFilterSlice,
  dictionarySlice,
  rackSlice,
  resultsSlice,
  settingsSlice,
  solveSlice,
  verifySlice,
} from './slices';

export type RootState = {
  board: ReturnType<typeof boardSlice.reducer>;
  cellFilter: ReturnType<typeof cellFilterSlice.reducer>;
  dictionary: ReturnType<typeof dictionarySlice.reducer>;
  rack: ReturnType<typeof rackSlice.reducer>;
  results: ReturnType<typeof resultsSlice.reducer>;
  settings: ReturnType<typeof settingsSlice.reducer>;
  solve: ReturnType<typeof solveSlice.reducer>;
  verify: ReturnType<typeof verifySlice.reducer>;
};
