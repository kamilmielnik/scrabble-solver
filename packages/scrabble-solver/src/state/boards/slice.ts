import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { boardsInitialState } from './initialState';
import { type BoardsMetadata, type BoardSnapshot } from './types';

/**
 * The collection of saved boards, and which one is in play.
 *
 * Every reducer here is a whole transition rather than a step towards one.
 * That is deliberate: the slice's invariant is that `saved` never contains
 * the active board (see `BoardsState`), and an API of smaller operations --
 * "store this snapshot", "now set the active id" -- would let a caller leave
 * it broken in between, or forget the second half entirely.
 */
export const boardsSlice = createSlice({
  initialState: boardsInitialState,
  name: 'boards',
  reducers: {
    /**
     * Replaces the active board with another, handing over the outgoing
     * board's state in the same step so it cannot be lost.
     */
    activated: (state, action: PayloadAction<{ id: string; outgoing: { id: string; snapshot: BoardSnapshot } }>) => {
      const { id, outgoing } = action.payload;

      if (!state.order.includes(id)) {
        return state;
      }

      const saved = { ...state.saved, [outgoing.id]: outgoing.snapshot };
      delete saved[id];
      return { ...state, activeId: id, saved };
    },

    /**
     * Appends a board and makes it active. A new board starts empty, and
     * unnamed -- it is labelled by its position until the user renames it.
     */
    created: (state, action: PayloadAction<{ id: string; outgoing: { id: string; snapshot: BoardSnapshot } }>) => {
      const { id, outgoing } = action.payload;

      return {
        ...state,
        activeId: id,
        order: [...state.order, id],
        saved: { ...state.saved, [outgoing.id]: outgoing.snapshot },
      };
    },

    /**
     * Removes a board. `nextActiveId` is required when removing the active
     * one, and is otherwise ignored -- it is the caller's job to have loaded
     * that board into the slices.
     */
    removed: (state, action: PayloadAction<{ id: string; nextActiveId?: string }>) => {
      const { id, nextActiveId } = action.payload;

      if (state.order.length <= 1 || !state.order.includes(id)) {
        return state;
      }

      const order = state.order.filter((boardId) => boardId !== id);
      const names = { ...state.names };
      const saved = { ...state.saved };
      delete names[id];
      delete saved[id];

      if (id !== state.activeId) {
        return { ...state, names, order, saved };
      }

      const activeId = nextActiveId && order.includes(nextActiveId) ? nextActiveId : order[0];
      delete saved[activeId];
      return { activeId, names, order, saved };
    },

    renamed: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const { id, name } = action.payload;

      if (!state.order.includes(id)) {
        return state;
      }

      return { ...state, names: { ...state.names, [id]: name.trim() } };
    },

    /** Applied once, from persisted state, during hydration. */
    init: (state, action: PayloadAction<{ metadata: BoardsMetadata; saved: Record<string, BoardSnapshot> }>) => {
      const { metadata, saved } = action.payload;

      if (metadata.order.length === 0 || !metadata.order.includes(metadata.activeId)) {
        return state;
      }

      const restored = { ...saved };
      delete restored[metadata.activeId];
      return { ...metadata, saved: restored };
    },
  },
});
