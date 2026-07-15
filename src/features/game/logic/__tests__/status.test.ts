import { describe, expect, it } from 'vitest'
import { getGameStatus } from '../status'
import type { Board } from '../../types'

describe('getGameStatus', () => {
  it('returns "lost" when no moves are available', () => {
    const board: Board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ]

    expect(getGameStatus(board)).toBe('lost')
  })

  it('returns "won" when a 2048 tile exists', () => {
    const board: Board = [
      [4, null, null, 2],
      [2048, null, null, null],
      [4, 2, null, null],
      [4, null, null, null],
    ]

    expect(getGameStatus(board)).toBe('won')
  })

  it('returns "playing" when moves remain and no winning tile exists', () => {
    const board: Board = [
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    expect(getGameStatus(board)).toBe('playing')
  })

  it('returns "playing" for a full board that still has an adjacent merge available', () => {
    const board: Board = [
      [2, 2, 4, 2],
      [4, 8, 2, 4],
      [2, 4, 8, 2],
      [4, 2, 4, 8],
    ]

    expect(getGameStatus(board)).toBe('playing')
  })
})
