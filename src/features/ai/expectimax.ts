import { getEmptyCells } from '../game/logic'
import { move } from '../game/logic/moves'
import type { Board } from '../game/types'
import { scoreBoard } from './heuristics'
import { DIRECTIONS, NEW_TILE_OUTCOMES } from './constants'

/** The player's turn: choose the direction that maximizes score gained plus the expected future outcome. */
function playerTurn(board: Board, depth: number): number {
  if (depth === 0) return scoreBoard(board)

  let best = -Infinity
  let hasValidMove = false

  for (const direction of DIRECTIONS) {
    const result = move(board, direction)
    if (!result.moved) continue
    hasValidMove = true
    // log2 keeps a big merge (e.g. +2048) from swamping the log-scaled heuristic below.
    const value = Math.log2(result.scoreGained + 1) + chanceTurn(result.board, depth - 1)
    best = Math.max(best, value)
  }

  return hasValidMove ? best : scoreBoard(board)
}

/** The game's turn: average the outcome over where/what tile could spawn next. */
function chanceTurn(board: Board, depth: number): number {
  const emptyCells = getEmptyCells(board)
  if (emptyCells.length === 0 || depth === 0) return scoreBoard(board)

  let expectedValue = 0

  for (const [row, col] of emptyCells) {
    for (const outcome of NEW_TILE_OUTCOMES) {
      const boardWithTile = board.map((r) => [...r])
      boardWithTile[row][col] = outcome.value
      const cellProbability = outcome.probability / emptyCells.length
      expectedValue += cellProbability * playerTurn(boardWithTile, depth - 1)
    }
  }

  return expectedValue
}

/** Expected heuristic value of a board, looking `depth` plies into the future. */
export function evaluateBoard(board: Board, depth: number): number {
  return chanceTurn(board, depth)
}
