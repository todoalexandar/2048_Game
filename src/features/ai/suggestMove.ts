import { move } from '../game/logic/moves'
import type { Board, Direction } from '../game/types'
import { DEFAULT_SEARCH_DEPTH, DIRECTIONS } from './constants'
import { evaluateBoard } from './expectimax'

/**
 * Suggests the best next move using expectimax search (offline, no network/API calls).
 * Returns null when the game is already over (no move changes the board).
 */
export function suggestMove(board: Board, depth: number = DEFAULT_SEARCH_DEPTH): Direction | null {
  let bestDirection: Direction | null = null
  let bestScore = -Infinity

  for (const direction of DIRECTIONS) {
    const result = move(board, direction)
    if (!result.moved) continue

    const score = Math.log2(result.scoreGained + 1) + evaluateBoard(result.board, depth - 1)
    if (score > bestScore) {
      bestScore = score
      bestDirection = direction
    }
  }

  return bestDirection
}
