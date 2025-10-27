# Implementation Plan: Short Hint and Long Hint Modes

## Overview
Add two new hint modes to the Scrabble solver UI that provide visual hints on the board without revealing the actual words:
- **Short Hint**: Shows only the starting position (first letter) of the top 3 scoring words
- **Long Hint**: Shows all letter positions of the top 3 scoring words as highlighted rectangles

## Design Decisions

### Backend
- **No changes required** - The existing `/api/solve` endpoint already returns all necessary data
- Results include cell positions for each word which we'll use for highlighting

### Frontend State Management
- Add display mode state to control what's shown (normal/short hint/long hint)
- **Reuse existing results state** - Results stay in Redux store after solve
- **No re-solve on mode switch** - Switching between modes just changes display
- Leverage existing `selectProcessedResults` selector for hint data

### UI/UX
- Replace SolveButton with a button group: "Solve", "Short Hint", "Long Hint"
- Buttons act as mode toggles - clicking active button does nothing
- In hint modes, hide the results list but keep the header
- Use different colors for the 3 hints (e.g., gold for #1, silver for #2, bronze for #3)
- Clear hints only when user makes board/rack changes (not on mode switch)

## Implementation Steps (Minimized for Code Reuse)

### Step 1: Add Display Mode to Results State
**File**: `packages/scrabble-solver/src/state/results/slice.ts`
- Add `displayMode: 'normal' | 'shortHint' | 'longHint'` to results state
- Add action: `setDisplayMode`
- Keep existing results data intact when switching modes

### Step 2: Replace SolveButton with Mode Buttons
**File**: `packages/scrabble-solver/src/components/Results/ModeButtons.tsx` (new)
- Create button group component with three buttons: "Solve", "Short Hint", "Long Hint"
- "Solve" button triggers `solveSlice.actions.submit()` then sets mode to 'normal'
- Hint buttons only change display mode if results exist (no solve trigger)
- Highlight active mode button

### Step 3: Update Results Component
**File**: `packages/scrabble-solver/src/components/Results/Results.tsx`
- Replace SolveButton instances with ModeButtons
- Conditionally hide results list based on displayMode:
  ```tsx
  const showResultsList = displayMode === 'normal' && !isOutdated && results.length > 0;
  ```
- Keep header and other UI elements visible

### Step 4: Extend Board Selectors for Hints
**File**: `packages/scrabble-solver/src/components/Board/selectors.ts`
- Modify existing `selectRowsWithCandidate` to also handle hint modes:
  ```typescript
  export const selectRowsWithCandidate = createSelector(
    [selectBoard, selectResultCandidateCells, selectDisplayMode, selectProcessedResults],
    (board, candidateCells, displayMode, results) => {
      // Existing candidate logic for normal mode
      if (displayMode === 'normal') {
        return board.rows.map((row, y) => 
          row.map((cell, x) => findCell(candidateCells, x, y) || cell)
        );
      }
      
      // Hint mode logic - mark cells from top 3 results
      const topResults = results?.slice(0, 3) || [];
      return board.rows.map((row, y) => 
        row.map((cell, x) => {
          // Check if cell is in any top result and mark with rank
          const hintCell = findHintCell(topResults, x, y, displayMode);
          return hintCell || cell;
        })
      );
    }
  );
  ```

### Step 5: Extend Cell Component for Hint Ranks
**File**: `packages/scrabble-solver/src/components/Board/components/Cell/Cell.tsx`
- Extend existing `highlighted` prop to accept boolean or rank number:
  ```tsx
  highlighted={cell.isCandidate() || cell.hintRank}
  ```
- Add conditional styling based on highlight value

### Step 6: Add Hint Styles to Existing Board Styles
**File**: `packages/scrabble-solver/src/components/Board/Board.module.scss`
- Add hint rank styles alongside existing highlight styles:
  ```scss
  .tile[data-hint-rank="1"] { outline: 3px solid gold; }
  .tile[data-hint-rank="2"] { outline: 3px solid silver; }
  .tile[data-hint-rank="3"] { outline: 3px solid #cd7f32; }
  ```

### Step 7: Reset Display Mode on User Actions
**File**: `packages/scrabble-solver/src/state/sagas.ts`
- In `onCellValueChange` and `onRackValueChange`:
  - Reset to normal mode: `yield put(resultsSlice.actions.setDisplayMode('normal'))`
  - This automatically clears hints without clearing results

## Key Implementation Details

### Behavior Flow
1. **Initial state**: Only "Solve" button enabled, hint buttons disabled
2. **After solve**: All three buttons enabled, results shown, mode is 'normal'
3. **Click "Short Hint"**: Hide results list, show first letters of top 3 on board
4. **Click "Long Hint"**: Hide results list, show all letters of top 3 on board  
5. **Click "Solve" again**: Show results list, clear board highlights
6. **Any board/rack change**: Reset to 'normal' mode, keep results if valid

### Minimal Code Changes Summary
- **1 new component**: ModeButtons.tsx (~50 lines)
- **1 state addition**: displayMode in results slice (~5 lines)
- **1 selector modification**: Extend selectRowsWithCandidate (~20 lines)
- **3 minor updates**: Results.tsx, Cell.tsx, sagas.ts (~10 lines total)
- **CSS additions**: ~5 lines for hint colors

**Total new code: ~90 lines** (excluding imports/styling)

## Testing Checklist
- [ ] Solve button works as before when no hints active
- [ ] Hint buttons disabled until first solve
- [ ] Short hint shows only first letters of top 3 words
- [ ] Long hint shows all letters of top 3 words
- [ ] Different colors for ranks 1, 2, 3
- [ ] Results list hidden in hint modes, visible in normal mode
- [ ] No backend call when switching between modes
- [ ] Mode resets to 'normal' when board/rack changes
- [ ] Works correctly with < 3 results
- [ ] Overlapping words handled gracefully
