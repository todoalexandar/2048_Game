import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { addRandomTile, createInitialBoard, getGameStatus, move } from './logic'
import type { Board, Direction, GameStatus } from './types'

export interface GameState {
  board: Board
  score: number
  status: GameStatus
  suggestion: Direction | null
}

function createInitialState(): GameState {
  return {
    board: createInitialBoard(),
    score: 0,
    status: 'playing',
    suggestion: null,
  }
}

const gameSlice = createSlice({
  name: 'game',
  initialState: createInitialState(),
  reducers: {
    moveRequested: (state, action: PayloadAction<Direction>) => {
      if (state.status !== 'playing') return

      const result = move(state.board, action.payload)
      if (!result.moved) return

      state.board = addRandomTile(result.board)
      state.score += result.scoreGained
      state.status = getGameStatus(state.board)
      state.suggestion = null
    },
    newGameRequested: (state) => {
      const fresh = createInitialState()
      state.board = fresh.board
      state.score = 0
      state.status = 'playing'
      state.suggestion = null
    },
    suggestionReceived: (state, action: PayloadAction<Direction | null>) => {
      state.suggestion = action.payload
    },
  },
})

export const { moveRequested, newGameRequested, suggestionReceived } = gameSlice.actions

export default gameSlice.reducer
