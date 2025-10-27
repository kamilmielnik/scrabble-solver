# Scrabble Solver Architecture Overview

## High-Level Flow

The scrabble solver follows a React/Redux architecture with a Next.js backend API:

1. **User Input**: User enters tiles in the rack and optionally places constraints on the board
2. **Solve Trigger**: User clicks the solve button or the solver auto-triggers on changes
3. **API Call**: Frontend dispatches Redux action that triggers a saga to call the backend API
4. **Backend Processing**: API endpoint uses the solver algorithm to find all valid words
5. **Results Display**: Results are shown in a list, hovering highlights word placement on board
6. **Word Application**: Clicking a result applies it to the board

## Key Components

### Frontend Architecture

#### State Management (`packages/scrabble-solver/src/state/`)
- **Redux Store** with slices for different concerns:
  - `solveSlice` (`solve/slice.ts`): Manages solve state (loading, errors, parameters)
  - `resultsSlice`: Manages the list of results and result candidate (hovered word)
  - `boardSlice`: Manages board state
  - `rackSlice`: Manages rack tiles

#### Sagas (`packages/scrabble-solver/src/state/sagas.ts`)
- **`onSolve`** (line 179): Main saga that:
  1. Collects board state, locale, and rack characters
  2. Calls SDK solve function
  3. Updates results in Redux store
  
#### UI Components

##### Solve Button (`packages/scrabble-solver/src/components/Results/SolveButton.tsx`)
- Triggers solve by dispatching `solveSlice.actions.submit()`
- Disabled when loading or no tiles in rack

##### Results Display (`packages/scrabble-solver/src/components/Results/`)
- **Results.tsx**: Container component that displays results list
- **Result.tsx**: Individual result row with word, points, coordinates
- Mouse events trigger `resultsSlice.actions.changeResultCandidate()` to highlight on board

##### Board Display (`packages/scrabble-solver/src/components/Board/`)
- **Board.tsx**: Main board component
- **BoardPure.tsx**: Pure rendering of board grid
- **Cell.tsx**: Individual cell component
  - `highlighted` prop controlled by `cell.isCandidate()` (line 111)
  - Candidate cells show where hovered word would be placed

##### Main Solver Component (`packages/scrabble-solver/src/components/Solver/Solver.tsx`)
- Orchestrates board, rack, and results
- Handles mouse/touch callbacks for result interaction:
  - `onMouseEnter`: Sets result as candidate (highlights on board)
  - `onMouseLeave`: Clears candidate
  - `onClick`: Applies result to board

### Backend Architecture

#### API Endpoint (`packages/scrabble-solver/src/pages/api/solve.ts`)
- Next.js API route that:
  1. Validates request parameters (board, characters, game, locale)
  2. Loads appropriate dictionary trie
  3. Calls solver algorithm
  4. Returns array of results

#### Solver Algorithm (`packages/solver/src/`)
- **`solve.ts`**: Main entry point
  - Generates all possible patterns on the board
  - Filters patterns that can be formed with available tiles
  - Returns sorted results by score

### Data Flow for Result Highlighting

1. **User hovers over result** → `onMouseEnter` callback
2. **Set candidate** → `resultsSlice.actions.changeResultCandidate(result)`
3. **Update board selector** → `selectRowsWithCandidate` merges candidate cells with board
4. **Cell rendering** → Cells check `isCandidate()` to show highlight
5. **Visual feedback** → Highlighted cells show where word would be placed

## Key Files Reference

- **Frontend SDK**: `/packages/scrabble-solver/src/sdk/solve.ts`
- **Redux Sagas**: `/packages/scrabble-solver/src/state/sagas.ts`
- **Board Selectors**: `/packages/scrabble-solver/src/components/Board/selectors.ts`
- **Backend API**: `/packages/scrabble-solver/src/pages/api/solve.ts`
- **Solver Core**: `/packages/solver/src/solve.ts`
- **Result Type**: `/packages/types/src/Result.ts`
