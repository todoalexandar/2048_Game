import type { Board, CellValue, Direction, MoveResult } from '../types'
import { reverseRows, transpose } from './transform'

/**
 * Slides one row's tiles left and merges equal neighbors, once per tile per move.
 * This is the single source of truth for merge behavior; every direction reuses it
 * via transpose/reverse composition below.
 */
function slideAndMergeRow(row: CellValue[]): { row: CellValue[]; scoreGained: number } {
  const values = row.filter((cell): cell is number => cell !== null)
  const merged: number[] = []
  let scoreGained = 0

  for (let i = 0; i < values.length; i += 1) {
    const current = values[i]
    const next = values[i + 1]

    if (next !== undefined && current === next) {
      const mergedValue = current * 2
      merged.push(mergedValue)
      scoreGained += mergedValue
      i += 1 // the next tile was consumed by this merge
    } else {
      merged.push(current)
    }
  }

  const padding = Array<CellValue>(row.length - merged.length).fill(null)
  return { row: [...merged, ...padding], scoreGained }
}

function boardsAreEqual(a: Board, b: Board): boolean {
  return a.every((row, r) => row.every((cell, c) => cell === b[r][c]))
}

function moveLeft(board: Board): MoveResult {
  let scoreGained = 0

  const nextBoard = board.map((row) => {
    const result = slideAndMergeRow(row)
    scoreGained += result.scoreGained
    return result.row
  })

  return { board: nextBoard, moved: !boardsAreEqual(board, nextBoard), scoreGained }
}

function withReversedRows(board: Board, apply: (b: Board) => MoveResult): MoveResult {
  const result = apply(reverseRows(board))
  return { ...result, board: reverseRows(result.board) }
}

function withTransposed(board: Board, apply: (b: Board) => MoveResult): MoveResult {
  const result = apply(transpose(board))
  return { ...result, board: transpose(result.board) }
}

/** Applies a move in the given direction, sliding and merging tiles once per tile. */
export function move(board: Board, direction: Direction): MoveResult {
  switch (direction) {
    case 'left':
      return moveLeft(board)
    case 'right':
      return withReversedRows(board, moveLeft)
    case 'up':
      return withTransposed(board, moveLeft)
    case 'down':
      return withTransposed(board, (b) => withReversedRows(b, moveLeft))
    default: {
      const exhaustiveCheck: never = direction
      throw new Error(`Unsupported direction: ${exhaustiveCheck}`)
    }
  }
}
