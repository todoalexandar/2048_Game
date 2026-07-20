import { describe, expect, it } from 'vitest'
import reducer, { moveRequested, newGameRequested, type GameState } from '../gameSlice'
import type { Board } from '../types'

function buildState(board: Board, overrides: Partial<GameState> = {}): GameState {
  return {
    board,
    score: 0,
    status: 'playing',
    ...overrides,
  }
}

describe('gameSlice', () => {
  it('moves the board, adds a random tile, and updates score on a valid move', () => {
    const before = buildState([
      [null, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ])

    const next = reducer(before, moveRequested('left'))

    expect(next.board[0][0]).toBe(2)
    expect(next.board.flat().filter((cell) => cell !== null)).toHaveLength(2)
  })

  it('does nothing when the move does not change the board', () => {
    const before = buildState([
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ])

    const next = reducer(before, moveRequested('left'))
    expect(next.board).toEqual(before.board)
  })

  it('ignores moves once the game has ended', () => {
    const lostBoard: Board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ]
    const before = buildState(lostBoard, { status: 'lost' })

    const next = reducer(before, moveRequested('left'))
    expect(next.board).toEqual(lostBoard)
  })

  it('starts a fresh board on newGameRequested', () => {
    const before = buildState(
      [
        [2048, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
      { score: 500, status: 'won' },
    )

    const next = reducer(before, newGameRequested())
    expect(next.score).toBe(0)
    expect(next.status).toBe('playing')
  })
})
