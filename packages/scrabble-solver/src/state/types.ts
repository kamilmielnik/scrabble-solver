import type { BoardState } from './board';
import type { CellFiltersState } from './cellFilters';
import type { DictionaryState } from './dictionary';
import type { RackState } from './rack';
import type { ResultsState } from './results';
import type { SettingsState } from './settings';
import type { SolveState } from './solve';
import type { VerifyState } from './verify';

export type RootState = {
  board: BoardState;
  cellFilters: CellFiltersState;
  dictionary: DictionaryState;
  rack: RackState;
  results: ResultsState;
  settings: SettingsState;
  solve: SolveState;
  verify: VerifyState;
};
