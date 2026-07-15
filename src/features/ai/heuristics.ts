import { getEmptyCells } from '../game/logic'
import { transpose } from '../game/logic/transform'
import type { Board, CellValue } from '../game/types'

const WEIGHTS = {
  emptyCells: 2.7,
  cellsInOrder: 1.0,
  neighborSimilarity: 0.1,
  maxValueInCorner: 1.0,
}

function toLog2(value: CellValue): number {
  return value === null ? 0 : Math.log2(value)
}

/** Rewards rows/columns that read as strictly increasing or decreasing, which keeps the board tidy. */
function lineOrderScore(line: CellValue[]): number {
  let increasing = 0
  let decreasing = 0

  for (let i = 0; i < line.length - 1; i += 1) {
    const diff = toLog2(line[i + 1]) - toLog2(line[i])
    if (diff > 0) increasing += diff
    else decreasing += -diff
  }

  return -Math.min(increasing, decreasing)
}

/** aka "monotonicity" in 2048 AI literature. */
export function cellsInOrderScore(board: Board): number {
  const columns = transpose(board)
  const rowScore = board.reduce((sum, row) => sum + lineOrderScore(row), 0)
  const colScore = columns.reduce((sum, col) => sum + lineOrderScore(col), 0)
  return rowScore + colScore
}

/** Penalizes large value gaps between neighboring tiles, favoring boards that are easy to merge further, aka "smoothness" in 2048 AI literature. */
export function neighborSimilarityScore(board: Board): number {
  let similarity = 0
  const rowCount = board.length
  const colCount = board[0].length

  for (let row = 0; row < rowCount; row += 1) {
    for (let col = 0; col < colCount; col += 1) {
      const value = board[row][col]
      if (value === null) continue

      const right = col + 1 < colCount ? board[row][col + 1] : null
      const below = row + 1 < rowCount ? board[row + 1][col] : null
      if (right !== null) similarity -= Math.abs(toLog2(value) - toLog2(right))
      if (below !== null) similarity -= Math.abs(toLog2(value) - toLog2(below))
    }
  }

  return similarity
}

/** Bonus for keeping the largest tile pinned in a corner, the standard "build in a corner" strategy. */
export function maxValueInCornerBonus(board: Board): number {
  const rowCount = board.length
  const colCount = board[0].length
  let maxValue = 0
  let maxRow = 0
  let maxCol = 0

  board.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value !== null && value > maxValue) {
        maxValue = value
        maxRow = r
        maxCol = c
      }
    })
  })

  const isCorner = (maxRow === 0 || maxRow === rowCount - 1) && (maxCol === 0 || maxCol === colCount - 1)
  return isCorner ? toLog2(maxValue) : 0
}

/** Higher is better. Combines empty space, cell ordering, neighbor similarity, and corner strategy into one comparable number. */
export function scoreBoard(board: Board): number {
  const emptyCellCount = getEmptyCells(board).length

  return (
    emptyCellCount * WEIGHTS.emptyCells +
    cellsInOrderScore(board) * WEIGHTS.cellsInOrder +
    neighborSimilarityScore(board) * WEIGHTS.neighborSimilarity +
    maxValueInCornerBonus(board) * WEIGHTS.maxValueInCorner
  )
}
