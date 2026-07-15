import type { Board, GameStatus } from '../types'
import { ALL_DIRECTIONS, WINNING_VALUE } from './constants'
import { move } from './moves'

export function hasWinningTile(board: Board): boolean {
  return board.some((row) => row.some((cell) => cell !== null && cell >= WINNING_VALUE))
}

/** Reuses `move` for every direction so "no moves left" can never disagree with actual move behavior. */
export function hasAvailableMoves(board: Board): boolean {
  return ALL_DIRECTIONS.some((direction) => move(board, direction).moved)
}

export function getGameStatus(board: Board): GameStatus {
  if (hasWinningTile(board)) return 'won'
  if (!hasAvailableMoves(board)) return 'lost'
  return 'playing'
}
