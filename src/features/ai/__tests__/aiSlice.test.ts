import { describe, expect, it } from 'vitest'
import reducer, { suggestionReceived, type AiState } from '../aiSlice'
import { moveRequested, newGameRequested } from '../../game/gameSlice'

function buildState(overrides: Partial<AiState> = {}): AiState {
  return {
    suggestion: null,
    ...overrides,
  }
}

describe('aiSlice', () => {
  it('stores the AI suggestion', () => {
    const before = buildState()

    const next = reducer(before, suggestionReceived('up'))
    expect(next.suggestion).toBe('up')
  })

  it('clears the suggestion once a move is requested', () => {
    const before = buildState({ suggestion: 'up' })

    const next = reducer(before, moveRequested('left'))
    expect(next.suggestion).toBeNull()
  })

  it('clears the suggestion on a new game', () => {
    const before = buildState({ suggestion: 'up' })

    const next = reducer(before, newGameRequested())
    expect(next.suggestion).toBeNull()
  })
})
