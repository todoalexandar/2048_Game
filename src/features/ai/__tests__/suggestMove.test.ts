import { describe, expect, it } from 'vitest'
import { suggestMove } from '../suggestMove'
import type { Board } from '../../game/types'

describe('suggestMove', () => {
  it('returns null when no moves are available', () => {
    const board: Board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ]

    expect(suggestMove(board)).toBeNull()
  })

  it('suggests a direction that actually changes the board', () => {
    const board: Board = [
      [2, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    expect(suggestMove(board, 1)).not.toBeNull()
  })

  it('prefers a merging move over a non-merging move when given the choice', () => {
    // Depth 1 scores each resulting board directly (no random-spawn sampling),
    // so this is deterministic: only left/right merge the pair; up doesn't move
    // at all; down just relocates the tiles without merging.
    const board: Board = [
      [2, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    expect(suggestMove(board, 1)).toBe('left')
  })

  it('changes its suggestion at greater depth, since only depth > 1 makes chanceTurn average over future spawns', () => {
    // At depth 1, evaluateBoard(board, 0) calls chanceTurn(board, 0), which hits its
    // depth === 0 base case immediately and never loops over empty cells. At depth 3,
    // chanceTurn actually averages playerTurn's outcome over where/what the next tile
    // could be - and for this board that changes which direction looks best.
    const board: Board = [
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [2, 4, 8, 16],
      [4, null, null, null],
    ]

    const shallow = suggestMove(board, 1)
    const deep = suggestMove(board, 3)

    expect(shallow).not.toBeNull()
    expect(deep).not.toBeNull()
    expect(deep).not.toBe(shallow)
  })
})
