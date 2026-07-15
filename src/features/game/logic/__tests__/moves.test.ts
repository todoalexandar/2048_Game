import { describe, expect, it } from 'vitest'
import { move } from '../moves'
import type { Board } from '../../types'

// Fixture from the spec's "Move Left" / "Move Right" / "Move Up" examples.
const TEST_BOARD: Board = [
  [null, 8, 2, 2],
  [4, 2, null, 2],
  [null, null, null, null],
  [null, null, null, 2],
]

describe('move', () => {
  it('moves left and merges tiles', () => {
    const result = move(TEST_BOARD, 'left')

    expect(result.board).toEqual([
      [8, 4, null, null],
      [4, 4, null, null],
      [null, null, null, null],
      [2, null, null, null],
    ])
    expect(result.moved).toBe(true)
  })

  it('moves right and merges tiles', () => {
    const result = move(TEST_BOARD, 'right')

    expect(result.board).toEqual([
      [null, null, 8, 4],
      [null, null, 4, 4],
      [null, null, null, null],
      [null, null, null, 2],
    ])
  })

  it('moves up and merges tiles', () => {
    const result = move(TEST_BOARD, 'up')

    expect(result.board).toEqual([
      [4, 8, 2, 4],
      [null, 2, null, 2],
      [null, null, null, null],
      [null, null, null, null],
    ])
  })

  it('moves down and merges tiles', () => {
    const result = move(TEST_BOARD, 'down')

    expect(result.board).toEqual([
      [null, null, null, null],
      [null, null, null, null],
      [null, 8, null, 2],
      [4, 2, 2, 4],
    ])
  })

  it('does not merge a tile twice in a single move', () => {
    const before: Board = [
      [2, 2, 2, 2],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    const result = move(before, 'left')
    expect(result.board[0]).toEqual([4, 4, null, null])
  })

  it('reports moved: false when a move does not change the board', () => {
    const before: Board = [
      [2, 4, 8, 16],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    const result = move(before, 'left')
    expect(result.moved).toBe(false)
    expect(result.board).toEqual(before)
  })

  it('computes score gained from merges', () => {
    const before: Board = [
      [4, 4, 2, 2],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    const result = move(before, 'left')
    expect(result.scoreGained).toBe(8 + 4)
  })
})
