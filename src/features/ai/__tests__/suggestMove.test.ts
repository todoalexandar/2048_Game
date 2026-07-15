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
})
