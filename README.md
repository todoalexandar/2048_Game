# 2048

A React + Redux Toolkit + TypeScript implementation of 2048, built from a set of provided
requirements: generate the initial board, support moves in all 4 directions, spawn a new tile
after each valid move, detect win/lose, and offer an offline AI move suggestion.

## Run it

```bash
yarn install
yarn start
```

Then open the printed local URL. Controls: arrow keys or WASD. "New Game" resets the board.
"Suggest Move" asks the built-in offline AI advisor for the best next move.

## Run the tests

```bash
yarn test
```

Vitest tests cover the exact before/after board examples from the requirements doc, plus edge
cases for merge-once-per-move, win/lose detection, the Redux slices, and the AI advisor.

## Project structure

```
src/
  app/                        Redux store setup and typed hooks
    store.ts                  configureStore, RootState/AppDispatch types
    hooks.ts                  useAppDispatch / useAppSelector (typed)

  features/
    game/                      Everything about the 2048 game itself
      types.ts                 Board, Direction, GameStatus, MoveResult
      gameSlice.ts              Redux Toolkit slice: orchestrates the pure logic below
      logic/                    Pure functions, no React/Redux dependency, fully unit-testable
        constants.ts            Board dimensions, win value, spawn probabilities
        board.ts                 createInitialBoard, addRandomTile, getEmptyCells
        transform.ts             transpose / reverseRows (used to derive all 4 directions)
        moves.ts                  move(board, direction) - the single merge implementation
        status.ts                 getGameStatus - win/lose detection
        __tests__/                Unit tests for the above
      hooks/
        useKeyboardControls.ts   Wires arrow keys / WASD to dispatching moves
      __tests__/
        gameSlice.test.ts        Reducer tests

    ai/                         Offline AI move suggestion
      constants.ts               Search depth, spawn odds
      heuristics.ts               scoreBoard: empty cells + cell ordering + neighbor similarity
                                   + corner bonus (aka monotonicity/smoothness in AI literature)
      expectimax.ts               Expectimax search (player-turn / chance-turn recursion)
      suggestMove.ts              Public API: suggestMove(board) -> best Direction
      aiSlice.ts                  Redux Toolkit slice: holds the current suggestion, clears it
                                   on game's moveRequested/newGameRequested via extraReducers
      __tests__/                  Unit tests for heuristics, move suggestion, and the slice

  components/                  Presentational, feature-agnostic where possible
    Board/                      4x4 grid rendering
    Tile/                       Single tile, color-coded by value
    ScoreBoard/                  Current score
    Controls/                    New Game / Suggest Move buttons
    GameOverlay/                 Win / lose overlay with New Game

  App.tsx                      Composes the components, wires up keyboard controls
  main.tsx                     React root, wraps App in the Redux <Provider>
```

## Design notes

- **One merge implementation.** `moveLeft` (inside `logic/moves.ts`) is the only place tiles slide
  and merge. Right, Up, and Down are derived by transposing and/or reversing the board, running
  `moveLeft`, then undoing the transform. One source of truth for the trickiest logic, and the
  four directions can never drift out of sync with each other.
- **Win/lose detection reuses `move`.** `hasAvailableMoves` tries all four directions via the same
  `move` function the game uses, so "no moves left" can never disagree with actual move behavior.
- **The AI suggestion is fully offline.** It runs an expectimax search (`features/ai/expectimax.ts`):
  the player-turn picks the direction that maximizes the expected outcome, the chance-turn averages
  over where a `2` (90%) or `4` (10%) tile could spawn next. Board quality is scored with a
  heuristic (`heuristics.ts`) combining empty-cell count, row/column ordering, similarity between
  neighboring tiles, and a bonus for keeping the largest tile in a corner.
- **The move's own score counts too.** Beyond scoring the resulting board position, the AI adds
  `Math.log2(scoreGained + 1)` for the merge that move itself produces, so it won't pass up a big
  merge just because the resulting board looks marginally less tidy. The `log2` keeps this
  comparable to the (also log-scaled) heuristic instead of letting a large raw point value swamp it.
- **Board dimensions aren't hardcoded to a square.** `createEmptyBoard` takes `rows`/`cols`
  separately (`BOARD_DIMENSIONS` in `logic/constants.ts`), and every function that depends on board
  size reads its own row/column count from the board itself rather than assuming they match.
- **Redux Toolkit slice stays declarative.** `gameSlice.ts` only knows about the pure `logic/`
  functions (move, addRandomTile, getGameStatus) - it doesn't reimplement any game rules itself.
  The AI module is a one-way dependency on top of `game/logic`; the game feature never imports AI.
- **AI suggestion state lives in its own slice.** `aiSlice.ts` owns `suggestion`, not `gameSlice.ts`,
  keeping the one-way dependency intact even in Redux state: it clears itself by listening for
  `game`'s `moveRequested`/`newGameRequested` actions via `extraReducers`, so `game` still has no
  knowledge that an AI feature exists.
- **Feature-folder structure.** Code is grouped by what it does (`game`, `ai`) rather than by
  technical layer, so all the code and tests for a concern live together.

## Assumptions

The spec deliberately leaves some details open; here's what was assumed, with rationale:

- **Initial board:** seeds a random 2-4 tiles (not just 2) of value `2` at random empty cells.
  The spec says "a random number of 2s" without a range - 2-4 mirrors the original 2048's usual
  starting density without flooding the board.
- **New tile spawn:** `2` with 90% probability, `4` with 10% - matches the original 2048 game,
  since the spec doesn't pin down the odds.
- **Merge rule:** a tile can merge at most once per move (standard 2048 behavior), e.g. `[2,2,2,2]`
  moving left becomes `[4,4,null,null]`, not `[8,null,null,null]`.
- **Win condition:** the game flags `won` the first time a `2048` tile appears, and the overlay
  shows a win message with a "New Game" option. The spec only asks to *detect* the win condition,
  not to allow continuing play past it, so play stops there rather than adding a way to keep going.
