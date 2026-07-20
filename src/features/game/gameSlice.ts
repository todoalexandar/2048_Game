import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { addRandomTile, createInitialBoard, getGameStatus, move } from './logic'
import type { Board, Direction, GameStatus } from './types'

export interface GameState {
  board: Board
  score: number
  status: GameStatus
}

function createInitialState(): GameState {
  return {
    board: createInitialBoard(),
    score: 0,
    status: 'playing',
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
    },
    newGameRequested: (state) => {
      const fresh = createInitialState()
      state.board = fresh.board
      state.score = 0
      state.status = 'playing'
    },
  },
})

export const { moveRequested, newGameRequested } = gameSlice.actions

export default gameSlice.reducer
