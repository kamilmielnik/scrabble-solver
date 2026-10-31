import { type BoardJson } from '@scrabble-solver/types';

import { type CellFilter, type Rack } from '@/types';

/** Everything that belongs to one saved board. */
export interface BoardSnapshot {
  board: BoardJson;
  cellFilters: CellFilter[];
  rack: Rack;
}

export interface BoardsMetadata {
  activeId: string;
  names: Record<string, string>;
  /** Tab order. */
  order: string[];
}

export interface BoardsState extends BoardsMetadata {
  /**
   * Saved state for every board *except* the active one.
   *
   * The active board's authoritative state stays in the `board`, `rack` and
   * `cellFilters` slices, so that the hundreds of existing selectors and
   * dispatches -- and the board's render budget, which depends on those
   * selectors staying identity-stable -- are untouched by this feature. The
   * price is this invariant: `saved` never holds an entry for `activeId`.
   * It is kept by making every transition a single atomic reducer below,
   * rather than something a caller assembles from smaller steps.
   */
  saved: Record<string, BoardSnapshot>;
}
