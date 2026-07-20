import { configureStore } from '@reduxjs/toolkit'
import aiReducer from '../features/ai/aiSlice'
import gameReducer from '../features/game/gameSlice'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    ai: aiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
