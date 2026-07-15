import type { Board } from '../types'

/** Flips rows and columns, so a column can be processed with row-based logic. */
export function transpose(board: Board): Board {
  return board[0].map((_, colIndex) => board.map((row) => row[colIndex]))
}

/** Reverses each row, so a rightward slide can reuse leftward logic. */
export function reverseRows(board: Board): Board {
  return board.map((row) => [...row].reverse())
}
