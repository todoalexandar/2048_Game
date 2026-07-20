import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { moveRequested, newGameRequested } from '../game/gameSlice'
import type { Direction } from '../game/types'

export interface AiState {
  suggestion: Direction | null
}

function createInitialState(): AiState {
  return {
    suggestion: null,
  }
}

const aiSlice = createSlice({
  name: 'ai',
  initialState: createInitialState(),
  reducers: {
    suggestionReceived: (state, action: PayloadAction<Direction | null>) => {
      state.suggestion = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(moveRequested, (state) => {
        state.suggestion = null
      })
      .addCase(newGameRequested, (state) => {
        state.suggestion = null
      })
  },
})

export const { suggestionReceived } = aiSlice.actions

export default aiSlice.reducer
